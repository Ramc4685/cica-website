<?php
declare(strict_types=1);

// No credentials or visitor records belong in the public document root.
function cica_validate(array $input): array
{
    $type = $input['type'] ?? '';
    $schemas = [
        'contact' => ['firstName' => 50, 'lastName' => 50, 'email' => 254, 'phone' => 30, 'subject' => 200, 'message' => 3000],
        'updates' => ['name' => 100, 'email' => 254, 'phone' => 30],
        'sponsor' => ['fullName' => 100, 'company' => 200, 'email' => 254, 'phone' => 30, 'interest' => 200, 'message' => 3000],
    ];
    if (!is_string($type) || !isset($schemas[$type])) {
        throw new InvalidArgumentException('Choose a supported request type.');
    }
    if (!isset($input['website']) || !is_string($input['website']) || $input['website'] !== '') {
        throw new InvalidArgumentException('Unable to accept this request. Please email the organizers.');
    }
    $clean = ['type' => $type];
    foreach ($schemas[$type] as $field => $limit) {
        $value = $input[$field] ?? '';
        if (!is_string($value) || !preg_match('//u', $value)) {
            throw new InvalidArgumentException('Check the information you entered.');
        }
        $value = trim($value);
        $length = preg_match_all('/./us', $value);
        if ($length === false || $length > $limit || ($field !== 'phone' && $value === '')) {
            throw new InvalidArgumentException('Complete the required fields and keep your message under 3,000 characters.');
        }
        if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $value)) {
            throw new InvalidArgumentException('Check the information you entered.');
        }
        $clean[$field] = $value;
    }
    if (!filter_var($clean['email'], FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $clean['email'])) {
        throw new InvalidArgumentException('Enter a valid email address.');
    }
    if ($clean['phone'] !== '' && (!preg_match('/^[+\d\s().-]+$/', $clean['phone']) || strlen(preg_replace('/\D/', '', $clean['phone'])) < 7)) {
        throw new InvalidArgumentException('Enter a valid phone number or leave it blank.');
    }
    return $clean;
}

// The same artifact serves both sites; the document root decides which one is running.
function cica_site(string $resolvedRoot): ?array
{
    $sites = [
        '/home/cicanrkn/public_html' => ['origins' => ['https://cicainfo.com', 'https://www.cicainfo.com'], 'storage' => '.cica-forms', 'subjectPrefix' => ''],
        '/home/cicanrkn/staging_html' => ['origins' => ['https://staging.cicainfo.com'], 'storage' => '.cica-forms-staging', 'subjectPrefix' => '[STAGING] '],
    ];
    return $sites[$resolvedRoot] ?? null;
}

function cica_origin_allowed(array $site, string $origin): bool
{
    return in_array($origin, $site['origins'], true);
}

function cica_private_directory(string $resolvedRoot, array $site): string
{
    $dir = dirname($resolvedRoot) . '/' . $site['storage'];
    if (is_link($dir) || (!is_dir($dir) && !mkdir($dir, 0700))) {
        throw new RuntimeException('Private storage is unavailable.');
    }
    if (!chmod($dir, 0700)) {
        throw new RuntimeException('Private storage permissions are unavailable.');
    }
    return $dir;
}

function cica_open_private(string $path)
{
    if (is_link($path)) {
        throw new RuntimeException('Private storage is unavailable.');
    }
    $file = fopen($path, 'c+');
    if ($file === false || !chmod($path, 0600)) {
        throw new RuntimeException('Private storage is unavailable.');
    }
    return $file;
}

// Per-IP, global and storage limits. Over a limit the visitor gets a definite 429, never a silent failure.
const CICA_IP_LIMIT = 10;
const CICA_IP_WINDOW = 600;
const CICA_HOURLY_CAP = 60;
const CICA_DAILY_CAP = 300;
const CICA_MAX_RECORD_BYTES = 20 * 1024 * 1024;
const CICA_MAX_ARCHIVES = 10;

class CicaRateLimited extends OverflowException
{
    public int $retryAfter;
    public function __construct(string $message, int $retryAfter)
    {
        parent::__construct($message);
        $this->retryAfter = $retryAfter;
    }
}

function cica_acquire_lock($lock, int $timeoutMs = 3000): bool
{
    $deadline = microtime(true) + $timeoutMs / 1000;
    do {
        if (flock($lock, LOCK_EX | LOCK_NB)) {
            return true;
        }
        usleep(50000);
    } while (microtime(true) < $deadline);
    return false;
}

function cica_alert_storage(string $subject, string $body): void
{
    @mail(
        'organizers@cicainfo.com',
        '[CICA website] ' . $subject,
        wordwrap($body, 70, "\r\n"),
        ['From' => 'CICA Website <organizers@cicainfo.com>', 'Content-Type' => 'text/plain; charset=UTF-8', 'MIME-Version' => '1.0'],
        '-forganizers@cicainfo.com'
    );
}

// Archives a full record file instead of refusing new requests; archives stay private and are never deleted here.
function cica_rotate_if_full(string $dir, int $now, int $maxBytes, callable $alert): void
{
    $path = $dir . '/requests.jsonl';
    clearstatcache(true, $path);
    if (!is_file($path) || is_link($path) || filesize($path) < $maxBytes) {
        return;
    }
    if (count(glob($dir . '/requests-*.jsonl') ?: []) >= CICA_MAX_ARCHIVES) {
        throw new RuntimeException('Private storage needs organizer attention.');
    }
    $archive = $dir . '/requests-' . gmdate('Ymd-His', $now) . '.jsonl';
    if (file_exists($archive) || !rename($path, $archive)) {
        throw new RuntimeException('Private storage is unavailable.');
    }
    $alert('Form storage rotated', "The request file reached its size limit and was archived as " . basename($archive) . " in the private .cica-forms directory. Export or delete archived records you no longer need.");
}

function cica_save_request(array $fields, string $dir, string $remoteAddress, int $now, array $options = []): array
{
    $maxBytes = $options['maxBytes'] ?? CICA_MAX_RECORD_BYTES;
    $alert = $options['alert'] ?? 'cica_alert_storage';
    $lock = cica_open_private($dir . '/requests.lock');
    if (!cica_acquire_lock($lock)) {
        fclose($lock);
        throw new RuntimeException('The request service is busy.');
    }
    try {
        $stateFile = cica_open_private($dir . '/limits.json');
        $state = json_decode(stream_get_contents($stateFile), true) ?: [];
        // A private salt keeps stored buckets from being reversed into IP addresses by brute force.
        $saltFile = cica_open_private($dir . '/hash.salt');
        $salt = trim((string)stream_get_contents($saltFile));
        if ($salt === '') {
            $salt = bin2hex(random_bytes(16));
            fwrite($saltFile, $salt);
            fflush($saltFile);
        }
        fclose($saltFile);
        $bucket = substr(hash('sha256', $salt . $remoteAddress), 0, 12);
        $ips = $state['ips'] ?? [];
        foreach ($ips as $key => $entry) {
            if ($now - ($entry['start'] ?? 0) >= CICA_IP_WINDOW) {
                unset($ips[$key]);
            }
        }
        $recent = $ips[$bucket] ?? ['start' => $now, 'count' => 0];
        $global = $state['global'] ?? [];
        if (!isset($global['hourStart']) || $now - $global['hourStart'] >= 3600) {
            $global['hourStart'] = $now;
            $global['hourCount'] = 0;
        }
        if (!isset($global['dayStart']) || $now - $global['dayStart'] >= 86400) {
            $global['dayStart'] = $now;
            $global['dayCount'] = 0;
        }
        if ($recent['count'] >= CICA_IP_LIMIT) {
            fclose($stateFile);
            throw new CicaRateLimited('Too many requests. Please wait ten minutes or email the organizers.', max(1, CICA_IP_WINDOW - ($now - $recent['start'])));
        }
        if ($global['hourCount'] >= CICA_HOURLY_CAP || $global['dayCount'] >= CICA_DAILY_CAP) {
            fclose($stateFile);
            $retry = $global['hourCount'] >= CICA_HOURLY_CAP ? 3600 - ($now - $global['hourStart']) : 86400 - ($now - $global['dayStart']);
            throw new CicaRateLimited('The form is receiving a lot of requests right now. Please try again later or email the organizers.', max(1, $retry));
        }
        try {
            cica_rotate_if_full($dir, $now, $maxBytes, $alert);
        } catch (Throwable $e) {
            fclose($stateFile);
            throw $e;
        }
        $records = cica_open_private($dir . '/requests.jsonl');
        $id = bin2hex(random_bytes(12));
        $record = ['id' => $id, 'receivedAt' => gmdate('c', $now), 'fields' => $fields];
        $line = json_encode($record, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE) . "\n";
        fseek($records, 0, SEEK_END);
        if (fwrite($records, $line) !== strlen($line) || !fflush($records)) {
            fclose($records);
            fclose($stateFile);
            throw new RuntimeException('Unable to save the request.');
        }
        $size = fstat($records)['size'];
        fclose($records);
        $recent['count']++;
        $ips[$bucket] = $recent;
        $global['hourCount']++;
        $global['dayCount']++;
        $state = ['ips' => $ips, 'global' => $global, 'alertedAt' => $state['alertedAt'] ?? 0];
        // alertedAt 0 means "never alerted", not a timestamp to throttle against.
        if ($size >= (int)($maxBytes * 0.8) && ($state['alertedAt'] === 0 || $now - $state['alertedAt'] >= 7 * 86400)) {
            $state['alertedAt'] = $now;
            $alert('Form storage is 80% full', "The request file is at least 80% of its size limit. When full it is archived automatically; up to " . CICA_MAX_ARCHIVES . " archives are kept before new requests are refused. Review and export records with scripts/forms-records.php.");
        }
        rewind($stateFile);
        ftruncate($stateFile, 0);
        fwrite($stateFile, json_encode($state, JSON_THROW_ON_ERROR));
        fflush($stateFile);
        fclose($stateFile);
        return $record;
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function cica_notify(array $record, array $site): bool
{
    $labels = ['contact' => 'Contact request', 'updates' => 'Updates request', 'sponsor' => 'Sponsorship inquiry'];
    $body = 'CICA website request ' . $record['id'] . "\r\nReceived: " . $record['receivedAt'] . "\r\n\r\n";
    foreach ($record['fields'] as $field => $value) {
        $body .= $field . ': ' . $value . "\r\n";
    }
    return mail(
        'organizers@cicainfo.com',
        $site['subjectPrefix'] . '[CICA website] ' . $labels[$record['fields']['type']],
        wordwrap($body, 70, "\r\n"),
        ['From' => 'CICA Website <organizers@cicainfo.com>', 'Reply-To' => $record['fields']['email'], 'Content-Type' => 'text/plain; charset=UTF-8', 'MIME-Version' => '1.0'],
        '-forganizers@cicainfo.com'
    );
}

function cica_reply(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body);
    exit;
}

// No-JS form posts get a redirect on success and a small HTML page on failure.
function cica_form_reply(int $status, array $body): never
{
    if ($status === 200) {
        header('Location: /thank-you/?ref=' . rawurlencode((string)$body['reference']), true, 303);
        header('Cache-Control: no-store');
        exit;
    }
    http_response_code($status);
    header('Content-Type: text/html; charset=UTF-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    $message = htmlspecialchars((string)($body['message'] ?? 'We could not save your request.'), ENT_QUOTES, 'UTF-8');
    echo '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Request not sent | CICA</title></head><body style="font-family:system-ui,sans-serif;max-width:36rem;margin:4rem auto;padding:0 1rem"><h1>Request not sent</h1><p>' . $message . '</p><p><a href="javascript:history.back()">Go back and try again</a> or email <a href="mailto:organizers@cicainfo.com">organizers@cicainfo.com</a>.</p></body></html>';
    exit;
}

// CLI regression tests load functions without making requests or sending mail.
if (defined('CICA_FORMS_TESTING') && CICA_FORMS_TESTING === true && PHP_SAPI === 'cli') {
    return;
}
ini_set('display_errors', '0');
umask(0077);
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    cica_reply(405, ['success' => false, 'message' => 'Use the CICA website form to submit a request.']);
}
$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
$isJson = strpos($contentType, 'application/json') === 0;
$isForm = strpos($contentType, 'application/x-www-form-urlencoded') === 0;
$reply = $isForm ? 'cica_form_reply' : 'cica_reply';
$resolvedRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '');
$site = is_string($resolvedRoot) ? cica_site($resolvedRoot) : null;
if ($site === null) {
    error_log('CICA form service: unexpected document root');
    $reply(503, ['success' => false, 'message' => 'We could not save your request. Please email organizers@cicainfo.com.']);
}
if (!cica_origin_allowed($site, $_SERVER['HTTP_ORIGIN'] ?? '')) {
    $reply(403, ['success' => false, 'message' => 'Submit your request from the CICA website.']);
}
if (!$isJson && !$isForm) {
    cica_reply(415, ['success' => false, 'message' => 'Unsupported request format.']);
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) {
    $reply(413, ['success' => false, 'message' => 'The request is too large.']);
}
try {
    if ($isForm) {
        $input = $_POST;
    } else {
        $raw = file_get_contents('php://input', false, null, 0, 16385);
        if ($raw === false || strlen($raw) > 16384) {
            cica_reply(413, ['success' => false, 'message' => 'The request is too large.']);
        }
        $input = json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
    }
    if (!is_array($input)) {
        throw new InvalidArgumentException('Check the information you entered.');
    }
    $fields = cica_validate($input);
    $dir = cica_private_directory($resolvedRoot, $site);
    $record = cica_save_request($fields, $dir, $_SERVER['REMOTE_ADDR'] ?? '', time());
    try {
        $queued = cica_notify($record, $site);
    } catch (Throwable $notificationError) {
        $queued = false;
    }
    if (!$queued) {
        // Only the reference is logged; the saved private request remains available.
        error_log('CICA notification not queued: ' . $record['id']);
    }
    $reply(200, ['success' => true, 'reference' => $record['id']]);
} catch (JsonException | InvalidArgumentException $e) {
    $reply(422, ['success' => false, 'message' => $e instanceof JsonException ? 'Check the information you entered.' : $e->getMessage()]);
} catch (CicaRateLimited $e) {
    header('Retry-After: ' . $e->retryAfter);
    $reply(429, ['success' => false, 'message' => $e->getMessage()]);
} catch (Throwable $e) {
    error_log('CICA form service error: ' . get_class($e));
    $reply(503, ['success' => false, 'message' => 'We could not save your request. Please email organizers@cicainfo.com.']);
}
