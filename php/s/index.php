<?php
$id = basename($_SERVER['REQUEST_URI']);
$path = __DIR__ . '/../shortened/' . preg_replace('/[^a-zA-Z0-9]/', '', $id) . '.txt';

if (file_exists($path)) {
    $url = trim(file_get_contents($path));
    header("Location: $url", true, 301);
    exit;
} else {
    http_response_code(404);
    echo "Shortened URL not found.";
}
