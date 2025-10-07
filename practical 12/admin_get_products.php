<?php
session_start();
header('Content-Type: application/json');

require_once 'db/db_config.php';

$response = ['success' => false, 'products' => []];

if (!isset($_SESSION['admin_id'])) {
    echo json_encode($response);
    exit;
}

try {
    $stmt = $conn->query("
        SELECT p.*, CONCAT(u.first_name, ' ', u.last_name) as seller_name 
        FROM products p 
        LEFT JOIN users u ON p.seller_id = u.u_id 
        ORDER BY p.p_id DESC
    ");

    $products = [];
    while ($row = $stmt->fetch_assoc()) {
        $products[] = $row;
    }

    $response['success'] = true;
    $response['products'] = $products;
} catch (Exception $e) {
    $response['message'] = $e->getMessage();
}

$conn->close();
echo json_encode($response);
