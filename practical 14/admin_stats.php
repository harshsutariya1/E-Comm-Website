<?php
session_start();
header('Content-Type: application/json');

require_once 'db/db_config.php';

$response = ['success' => false, 'stats' => [], 'message' => ''];

if (!isset($_SESSION['admin_id'])) {
    $response['message'] = 'Unauthorized access';
    echo json_encode($response);
    exit;
}

try {
    $stats = [];

    // Total users (active and inactive)
    $result = $conn->query("SELECT COUNT(*) as count FROM users");
    $stats['total_users'] = $result->fetch_assoc()['count'];

    // Total active sellers
    $result = $conn->query("SELECT COUNT(*) as count FROM users WHERE is_seller = 1 AND is_seller_active = 1");
    $stats['total_sellers'] = $result->fetch_assoc()['count'];

    // Total products
    $result = $conn->query("SELECT COUNT(*) as count FROM products");
    $stats['total_products'] = $result->fetch_assoc()['count'];

    // Total orders
    $result = $conn->query("SELECT COUNT(*) as count FROM orders");
    $stats['total_orders'] = $result->fetch_assoc()['count'];

    $response['success'] = true;
    $response['stats'] = $stats;
} catch (Exception $e) {
    $response['message'] = 'Error fetching statistics: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
