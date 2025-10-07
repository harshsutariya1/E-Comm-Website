<?php
session_start();
header('Content-Type: application/json');

$response = ['logged_in' => false];

if (isset($_SESSION['admin_id'])) {
    $response['logged_in'] = true;
    $response['admin'] = [
        'admin_id' => $_SESSION['admin_id'],
        'email' => $_SESSION['admin_email']
    ];
}

echo json_encode($response);
