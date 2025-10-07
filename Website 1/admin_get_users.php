<?php
session_start();
header('Content-Type: application/json');

require_once 'db/db_config.php';

$response = ['success' => false, 'users' => []];

if (!isset($_SESSION['admin_id'])) {
    echo json_encode($response);
    exit;
}

try {
    $stmt = $conn->query("SELECT u_id, first_name, last_name, email, is_seller, phone_number, address, total_user_orders, is_user_active, created_at FROM users ORDER BY u_id DESC");

    $users = [];
    while ($row = $stmt->fetch_assoc()) {
        $users[] = $row;
    }

    $response['success'] = true;
    $response['users'] = $users;
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);
