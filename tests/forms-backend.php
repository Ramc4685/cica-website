<?php
declare(strict_types=1);
define('CICA_FORMS_TESTING', true);
require dirname(__DIR__) . '/public/forms/submit.php';

$checks = 0;
function check(bool $condition, string $name): void {
    global $checks;
    if (!$condition) { throw new RuntimeException('Failed: ' . $name); }
    $checks++;
}
function rejects(array $input): bool {
    try { cica_validate($input); return false; }
    catch (InvalidArgumentException $e) { return true; }
}
$valid = ['type' => 'contact', 'firstName' => '  José  ', 'lastName' => '李', 'email' => 'test@example.test', 'phone' => '', 'subject' => 'Test only', 'message' => 'This is a local validation test.', 'website' => ''];
$clean = cica_validate($valid);
check($clean['firstName'] === 'José' && $clean['lastName'] === '李', 'Unicode names and trimming');
check($clean['phone'] === '', 'Optional phone');
check(rejects(array_replace($valid, ['email' => "test@example.test\r\nBcc: other@example.test"])), 'Header injection rejected');
check(rejects(array_replace($valid, ['website' => 'spam'])), 'Honeypot rejected');
check(rejects(array_replace($valid, ['firstName' => '   '])), 'Blank names rejected');
check(rejects(array_replace($valid, ['message' => str_repeat('a', 4001)])), 'Message limit enforced');
check(rejects(array_replace($valid, ['email' => ['test@example.test']])), 'Non-string values rejected');
check(rejects(array_replace($valid, ['type' => 'arbitrary'])), 'Type allowlist');
$production = cica_site('/home/cicanrkn/public_html');
$staging = cica_site('/home/cicanrkn/staging_html');
check($production !== null && $staging !== null && cica_site('/home/cicanrkn') === null && cica_site('/tmp/public_html') === null, 'Only the two known document roots');
check(cica_origin_allowed($production, 'https://cicainfo.com') && cica_origin_allowed($production, 'https://www.cicainfo.com'), 'Both website origins');
check(!cica_origin_allowed($production, 'https://cicainfo.com.attacker.test') && !cica_origin_allowed($production, ''), 'Foreign/missing origin rejected');
check(!cica_origin_allowed($production, 'https://staging.cicainfo.com') && cica_origin_allowed($staging, 'https://staging.cicainfo.com'), 'Staging origin only on staging');
check(!cica_origin_allowed($staging, 'https://cicainfo.com'), 'Production origin rejected on staging');
check($staging['storage'] !== $production['storage'] && $staging['subjectPrefix'] === '[STAGING] ' && $production['subjectPrefix'] === '', 'Staging records and mail stay separate');
check(cica_validate(['type' => 'updates', 'name' => 'A person', 'email' => 'test@example.test', 'website' => ''])['type'] === 'updates', 'Updates schema');
check(cica_validate(['type' => 'sponsor', 'fullName' => 'A person', 'company' => 'A company', 'email' => 'test@example.test', 'interest' => 'Events', 'message' => 'A sponsorship inquiry.', 'website' => ''])['type'] === 'sponsor', 'Sponsor schema');
$dir = sys_get_temp_dir() . '/cica-forms-test-' . bin2hex(random_bytes(8));
mkdir($dir, 0700);
try {
    $record = cica_save_request($clean, $dir, '127.0.0.1', 1000);
    check(strlen($record['id']) === 24, 'Opaque request reference');
    $saved = json_decode(trim(file_get_contents($dir . '/requests.jsonl')), true);
    check($saved['fields']['lastName'] === '李' && !isset($saved['ip']), 'Private record content, no raw IP');
    check((fileperms($dir . '/requests.jsonl') & 0777) === 0600, 'Private file mode');
    $alerts = [];
    $options = ['alert' => function (string $subject) use (&$alerts) { $alerts[] = $subject; }];
    for ($i = 0; $i < CICA_IP_LIMIT - 1; $i++) { cica_save_request($clean, $dir, '127.0.0.1', 1001, $options); }
    try { cica_save_request($clean, $dir, '127.0.0.1', 1002, $options); check(false, 'Rate limit'); }
    catch (CicaRateLimited $e) { check($e->retryAfter > 0 && $e->retryAfter <= CICA_IP_WINDOW, 'Rate limit with Retry-After'); }
    check(count(file($dir . '/requests.jsonl')) === CICA_IP_LIMIT, 'Rejected request is not persisted');
    cica_save_request($clean, $dir, '127.0.0.1', 1001 + CICA_IP_WINDOW, $options);
    check(count(file($dir . '/requests.jsonl')) === CICA_IP_LIMIT + 1, 'Rate window expires');
    check(!str_contains(file_get_contents($dir . '/limits.json'), '127.0.0.1'), 'No raw IP in rate state');

    // A different IP is not throttled by another visitor's bucket.
    cica_save_request($clean, $dir, '10.0.0.2', 1001 + CICA_IP_WINDOW, $options);

    // Global hourly cap applies across IP addresses.
    $capDir = $dir . '/cap';
    mkdir($capDir, 0700);
    for ($i = 0; $i < CICA_HOURLY_CAP; $i++) { cica_save_request($clean, $capDir, '10.1.' . intdiv($i, 250) . '.' . ($i % 250), 5000, $options); }
    try { cica_save_request($clean, $capDir, '10.9.9.9', 5001, $options); check(false, 'Global cap'); }
    catch (CicaRateLimited $e) { check($e->retryAfter > 0 && $e->retryAfter <= 3600, 'Global hourly cap'); }
    cica_save_request($clean, $capDir, '10.9.9.9', 5000 + 3600, $options);
    check(true, 'Global cap resets after the hour');

    // Storage: alert near 80%, rotate (not fail) when full.
    $fullDir = $dir . '/full';
    mkdir($fullDir, 0700);
    // Four test records are ~1 KB, so a 1000-byte limit crosses the 80% alert on the fourth save.
    $small = ['maxBytes' => 1000] + $options;
    $alerts = [];
    for ($i = 0; $i < 4; $i++) { cica_save_request($clean, $fullDir, '10.2.0.' . $i, 9000, $small); }
    check(in_array('Form storage is 80% full', $alerts, true), 'Storage-fill alert');
    for ($i = 4; $i < 7; $i++) { cica_save_request($clean, $fullDir, '10.2.0.' . $i, 9000, $small); }
    check(count(glob($fullDir . '/requests-*.jsonl')) >= 1, 'Full file is archived');
    check(in_array('Form storage rotated', $alerts, true), 'Rotation alert');
    check(count(file($fullDir . '/requests.jsonl')) >= 1, 'New records continue after rotation');
    check(count($alerts) === 2 || count($alerts) === 3, 'Storage alert is not repeated each request');

    // A held lock is retried briefly instead of failing at once.
    $holder = fopen($dir . '/requests.lock', 'c+');
    flock($holder, LOCK_EX);
    $started = microtime(true);
    try { cica_save_request($clean, $dir, '10.3.0.1', 9500, $options); check(false, 'Lock timeout'); }
    catch (RuntimeException $e) { check(microtime(true) - $started >= 2.5, 'Blocking lock retries before giving up'); }
    flock($holder, LOCK_UN);
    fclose($holder);

    symlink($dir . '/requests.jsonl', $dir . '/unsafe');
    try { cica_open_private($dir . '/unsafe'); check(false, 'Symlink rejected'); }
    catch (RuntimeException $e) { check(true, 'Symlink rejected'); }
} finally {
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST) as $file) {
        $file->isDir() && !$file->isLink() ? rmdir($file->getPathname()) : unlink($file->getPathname());
    }
    rmdir($dir);
}
echo 'PASS: ' . $checks . " backend checks; no mail sent.\n";
