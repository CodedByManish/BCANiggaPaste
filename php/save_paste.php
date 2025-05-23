<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['content'], $_POST['id'])) {
    $id = preg_replace('/[^a-zA-Z0-9]/', '', $_POST['id']); 
    $content = $_POST['content'];
    $file = realpath(__DIR__ . '/../') . "/$id.txt";

    if (!is_dir(realpath(__DIR__ . '/../'))) {
        mkdir(realpath(__DIR__ . '/../'), 0777, true);
    }

    if (file_exists($file)) {
        echo json_encode(['success' => false, 'error' => 'ID already exists']);
        exit;
    }

    file_put_contents($file, $content);

    echo json_encode([
        'success' => true,
        'url' => "https://niggapaste.kesug.com/$id"
    ]);
} else {
    echo json_encode(['success' => false, 'error' => 'Missing content or ID']);
}
