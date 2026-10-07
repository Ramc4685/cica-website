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
check(cica_origin_allowed('https://cicainfo.com') && cica_origin_allowed('https://www.cicainfo.com'), 'Both website origins');
check(!cica_origin_allowed('https://cicainfo.com.attacker.test') && !cica_origin_allowed(''), 'Foreign/missing origin rejected');
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
    for ($i = 0; $i < 4; $i++) { cica_save_request($clean, $dir, '127.0.0.1', 1001); }
    try { cica_save_request($clean, $dir, '127.0.0.1', 1002); check(false, 'Rate limit'); }
    catch (OverflowException $e) { check(true, 'Rate limit'); }
    check(count(file($dir . '/requests.jsonl')) === 5, 'Rejected request is not persisted');
    cica_save_request($clean, $dir, '127.0.0.1', 1601);
    check(count(file($dir . '/requests.jsonl')) === 6, 'Rate window expires');
    symlink($dir . '/requests.jsonl', $dir . '/unsafe');
    try { cica_open_private($dir . '/unsafe'); check(false, 'Symlink rejected'); }
    catch (RuntimeException $e) { check(true, 'Symlink rejected'); }
} finally {
    foreach (glob($dir . '/*') as $file) { unlink($file); }
    rmdir($dir);
}
echo 'PASS: ' . $checks . " backend checks; no mail sent.\n";
