<?php
declare(strict_types=1);

// Run over SSH on the host: php forms-records.php list|export <ref>|delete <ref> [--dir=PATH]
// Never lists personal fields; export prints one record as JSON to the terminal only.
if (PHP_SAPI !== 'cli') {
    exit(1);
}
$args = array_slice($argv, 1);
$dir = '/home/cicanrkn/.cica-forms';
foreach ($args as $i => $arg) {
    if (str_starts_with($arg, '--dir=')) {
        $dir = substr($arg, 6);
        unset($args[$i]);
    }
}
$args = array_values($args);
$command = $args[0] ?? '';
$reference = $args[1] ?? '';
if (!in_array($command, ['list', 'export', 'delete'], true) || ($command !== 'list' && !preg_match('/^[a-f0-9]{24}$/', $reference))) {
    fwrite(STDERR, "Usage: php forms-records.php list | export <reference> | delete <reference> [--dir=PATH]\n");
    exit(2);
}
if (!is_dir($dir) || is_link($dir)) {
    fwrite(STDERR, "Private forms directory not found.\n");
    exit(1);
}
$files = array_merge(glob($dir . '/requests.jsonl') ?: [], glob($dir . '/requests-*.jsonl') ?: []);
$lock = fopen($dir . '/requests.lock', 'c+');
if ($lock === false || !flock($lock, LOCK_EX)) {
    fwrite(STDERR, "Could not lock the records.\n");
    exit(1);
}
$found = 0;
foreach ($files as $file) {
    if (is_link($file)) {
        continue;
    }
    $kept = [];
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $record = json_decode($line, true);
        $id = is_array($record) ? ($record['id'] ?? '') : '';
        if ($command === 'list') {
            echo $id . "\t" . ($record['receivedAt'] ?? '') . "\t" . ($record['fields']['type'] ?? '') . "\t" . basename($file) . "\n";
            continue;
        }
        if ($id === $reference) {
            $found++;
            if ($command === 'export') {
                echo json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
            }
            if ($command === 'delete') {
                continue;
            }
        }
        $kept[] = $line;
    }
    if ($command === 'delete' && $found > 0 && count($kept) !== count(file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES))) {
        $tmp = $file . '.tmp';
        file_put_contents($tmp, $kept ? implode("\n", $kept) . "\n" : '');
        chmod($tmp, 0600);
        rename($tmp, $file);
        echo "Deleted record $reference from " . basename($file) . ". Delete any organizer-inbox email for it separately.\n";
    }
}
flock($lock, LOCK_UN);
if ($command !== 'list' && $found === 0) {
    fwrite(STDERR, "No record with that reference.\n");
    exit(1);
}
