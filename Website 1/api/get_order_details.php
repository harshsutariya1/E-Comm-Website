<?php
session_start();
header('Content-Type: application/json');

require_once '../db/db_config.php';

$response = ['success' => false, 'message' => '', 'order_details' => [], 'user_info' => []];

if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'You must be logged in to view order details.';
    echo json_encode($response);
    exit;
}

$user_id = $_SESSION['user_id'];
$order_ids = isset($_GET['order_ids']) ? explode(',', $_GET['order_ids']) : [];

if (empty($order_ids)) {
    $response['message'] = 'Order IDs not provided.';
    echo json_encode($response);
    exit;
}

// Sanitize order IDs
$order_ids = array_map('intval', $order_ids);
$placeholders = str_repeat('?,', count($order_ids) - 1) . '?';

try {
    // Get order details
    $stmt = $conn->prepare("
        SELECT o.o_id, o.o_createdat, o.p_price, p.p_title, p.p_image, u.first_name, u.last_name
        FROM orders o
        JOIN products p ON o.p_id = p.p_id
        JOIN users u ON o.seller_id = u.u_id
        WHERE o.o_id IN ($placeholders) AND o.buyer_id = ?
    ");
    $params = array_merge($order_ids, [$user_id]);
    $stmt->bind_param(str_repeat('i', count($params)), ...$params);
    $stmt->execute();
    $result = $stmt->get_result();

    $order_details = [];
    while ($row = $result->fetch_assoc()) {
        $order_details[] = [
            'o_id' => $row['o_id'],
            'o_createdat' => $row['o_createdat'],
            'p_price' => $row['p_price'],
            'p_title' => $row['p_title'],
            'p_image' => $row['p_image'],
            'seller_name' => $row['first_name'] . ' ' . $row['last_name']
        ];
    }
    $stmt->close();

    // Get user info
    $stmt = $conn->prepare("SELECT first_name, last_name, address, phone_number FROM users WHERE u_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user_info = $result->fetch_assoc();
    $stmt->close();

    $response['success'] = true;
    $response['order_details'] = $order_details;
    $response['user_info'] = $user_info;
} catch (Exception $e) {
    $response['message'] = 'Error fetching order details: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
