<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['url'], $_POST['id'])) {
    $originalUrl = trim($_POST['url']);
    $id = preg_replace('/[^a-zA-Z0-9]/', '', $_POST['id']);

    if (!filter_var($originalUrl, FILTER_VALIDATE_URL)) {
        echo json_encode(['success' => false, 'error' => 'Invalid URL']);
        exit;
    }

    // Change this directory to root folder (htdocs/)
    $dir = realpath(__DIR__ . '/../') . '/';

    $file = $dir . $id . '.txt';

    if (file_exists($file)) {
        echo json_encode(['success' => false, 'error' => 'ID already exists']);
        exit;
    }

    $shortUrl = "https://niggapaste.kesug.com/$id";

    $data = json_encode([
        'original_url' => $originalUrl,
        'short_url' => $shortUrl
    ], JSON_PRETTY_PRINT);

    file_put_contents($file, $data);

    echo json_encode([
        'success' => true,
        'url' => $shortUrl
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Missing ID or URL']);
}
