<?php
session_start();
header('Content-Type: application/json');

require_once 'db/db_config.php';

$response = ['success' => false, 'sellers' => []];

if (!isset($_SESSION['admin_id'])) {
    echo json_encode($response);
    exit;
}

try {
    $stmt = $conn->query("
        SELECT u_id, first_name, last_name, seller_store_name 
        FROM users 
        WHERE is_seller = 1 AND is_seller_active = 1 
        ORDER BY first_name
    ");

    $sellers = [];
    while ($row = $stmt->fetch_assoc()) {
        $sellers[] = $row;
    }

    $response['success'] = true;
    $response['sellers'] = $sellers;
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);
