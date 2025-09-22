<?php
session_start();
header('Content-Type: application/json');

$response = ['logged_in' => false];

if (isset($_SESSION['user_id'])) {
    $response['logged_in'] = true;
    $response['user'] = [
        'first_name' => $_SESSION['first_name'],
        'last_name' => $_SESSION['last_name'],
        'email' => $_SESSION['email'],
        'is_seller' => $_SESSION['is_seller']
    ];
}

echo json_encode($response);
?>
