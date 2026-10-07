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

function cica_origin_allowed(string $origin): bool
{
    return in_array($origin, ['https://cicainfo.com', 'https://www.cicainfo.com'], true);
}

function cica_private_directory(string $root): string
{
    $resolvedRoot = realpath($root);
    if ($resolvedRoot !== '/home/cicanrkn/public_html') {
        throw new RuntimeException('Unexpected hosting configuration.');
    }
    $dir = dirname($resolvedRoot) . '/.cica-forms';
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

function cica_save_request(array $fields, string $dir, string $remoteAddress, int $now): array
{
    $lock = cica_open_private($dir . '/requests.lock');
    if (!flock($lock, LOCK_EX | LOCK_NB)) {
        fclose($lock);
        throw new RuntimeException('The request service is busy.');
    }
    try {
        $stateFile = cica_open_private($dir . '/limits.json');
        $state = json_decode(stream_get_contents($stateFile), true) ?: [];
        // Fixed buckets bound bookkeeping; raw IP addresses are not retained.
        $bucket = substr(hash('sha256', $remoteAddress), 0, 3);
        $recent = $state[$bucket] ?? ['start' => $now, 'count' => 0];
        if ($now - $recent['start'] >= 600) {
            $recent = ['start' => $now, 'count' => 0];
        }
        if ($recent['count'] >= 5) {
            fclose($stateFile);
            throw new OverflowException('Too many requests. Please wait ten minutes or email the organizers.');
        }
        $records = cica_open_private($dir . '/requests.jsonl');
        if (fstat($records)['size'] >= 20 * 1024 * 1024) {
            fclose($records);
            fclose($stateFile);
            throw new RuntimeException('Private storage needs organizer attention.');
        }
        $id = bin2hex(random_bytes(12));
        $record = ['id' => $id, 'receivedAt' => gmdate('c', $now), 'fields' => $fields];
        $line = json_encode($record, JSON_THROW_ON_ERROR | JSON_UNESCAPED_UNICODE) . "\n";
        fseek($records, 0, SEEK_END);
        if (fwrite($records, $line) !== strlen($line) || !fflush($records)) {
            fclose($records);
            fclose($stateFile);
            throw new RuntimeException('Unable to save the request.');
        }
        fclose($records);
        $recent['count']++;
        $state[$bucket] = $recent;
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

function cica_notify(array $record): bool
{
    $labels = ['contact' => 'Contact request', 'updates' => 'Updates request', 'sponsor' => 'Sponsorship inquiry'];
    $body = 'CICA website request ' . $record['id'] . "\r\nReceived: " . $record['receivedAt'] . "\r\n\r\n";
    foreach ($record['fields'] as $field => $value) {
        $body .= $field . ': ' . $value . "\r\n";
    }
    return mail(
        'organizers@cicainfo.com',
        '[CICA website] ' . $labels[$record['fields']['type']],
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
if (!cica_origin_allowed($_SERVER['HTTP_ORIGIN'] ?? '')) {
    cica_reply(403, ['success' => false, 'message' => 'Submit your request from the CICA website.']);
}
if (stripos($_SERVER['CONTENT_TYPE'] ?? '', 'application/json') !== 0) {
    cica_reply(415, ['success' => false, 'message' => 'Unsupported request format.']);
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 16384) {
    cica_reply(413, ['success' => false, 'message' => 'The request is too large.']);
}
try {
    $raw = file_get_contents('php://input', false, null, 0, 16385);
    if ($raw === false || strlen($raw) > 16384) {
        cica_reply(413, ['success' => false, 'message' => 'The request is too large.']);
    }
    $input = json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
    if (!is_array($input)) {
        throw new InvalidArgumentException('Check the information you entered.');
    }
    $fields = cica_validate($input);
    $dir = cica_private_directory($_SERVER['DOCUMENT_ROOT'] ?? '');
    $record = cica_save_request($fields, $dir, $_SERVER['REMOTE_ADDR'] ?? '', time());
    try {
        $queued = cica_notify($record);
    } catch (Throwable $notificationError) {
        $queued = false;
    }
    if (!$queued) {
        // Only the reference is logged; the saved private request remains available.
        error_log('CICA notification not queued: ' . $record['id']);
    }
    cica_reply(200, ['success' => true, 'reference' => $record['id']]);
} catch (JsonException | InvalidArgumentException $e) {
    cica_reply(422, ['success' => false, 'message' => $e instanceof JsonException ? 'Check the information you entered.' : $e->getMessage()]);
} catch (OverflowException $e) {
    header('Retry-After: 600');
    cica_reply(429, ['success' => false, 'message' => $e->getMessage()]);
} catch (Throwable $e) {
    error_log('CICA form service error: ' . get_class($e));
    cica_reply(503, ['success' => false, 'message' => 'We could not save your request. Please email organizers@cicainfo.com.']);
}
