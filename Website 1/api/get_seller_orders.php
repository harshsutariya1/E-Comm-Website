<?php
session_start();
header('Content-Type: application/json');

require_once '../db/db_config.php';

$response = ['success' => false, 'message' => '', 'orders' => []];

if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'You must be logged in to view orders.';
    echo json_encode($response);
    exit;
}

$user_id = $_SESSION['user_id'];

// Verify user is a seller
$stmt = $conn->prepare("SELECT is_seller FROM users WHERE u_id = ? AND is_user_active = 1");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    $response['message'] = 'User not found.';
    echo json_encode($response);
    $stmt->close();
    exit;
}

$user = $result->fetch_assoc();
if (!$user['is_seller']) {
    $response['message'] = 'Access denied. Seller account required.';
    echo json_encode($response);
    $stmt->close();
    exit;
}
$stmt->close();

try {
    // Get seller's orders
    $stmt = $conn->prepare("
        SELECT o.o_id, o.o_createdat, o.p_price, o.is_delivered, p.p_title, u.first_name, u.last_name
        FROM orders o
        JOIN products p ON o.p_id = p.p_id
        JOIN users u ON o.buyer_id = u.u_id
        WHERE o.seller_id = ?
        ORDER BY o.o_createdat DESC
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = [
            'o_id' => $row['o_id'],
            'o_createdat' => $row['o_createdat'],
            'p_price' => $row['p_price'],
            'is_delivered' => (bool) $row['is_delivered'],
            'p_title' => $row['p_title'],
            'buyer_name' => $row['first_name'] . ' ' . $row['last_name']
        ];
    }
    $stmt->close();

    $response['success'] = true;
    $response['orders'] = $orders;
} catch (Exception $e) {
    $response['message'] = 'Error fetching orders: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
