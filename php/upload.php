<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['file'], $_POST['id'])) {
    $id = preg_replace('/[^a-zA-Z0-9]/', '', $_POST['id']); // sanitize
    $uploadDir = realpath(__DIR__ . '/../') . '/'; // htdocs/

    $ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
    $filename = "$id.$ext";
    $targetPath = $uploadDir . $filename;

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);  // normally root folder already exists
    }

    if (file_exists($targetPath)) {
        echo json_encode(['success' => false, 'error' => 'ID already exists']);
        exit;
    }

    if (move_uploaded_file($_FILES['file']['tmp_name'], $targetPath)) {
        echo json_encode([
            'success' => true,
            'url' => "https://niggapaste.kesug.com/$filename"
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Upload failed']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Missing file or ID']);
}
