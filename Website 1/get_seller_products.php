<?php
session_start();
header('Content-Type: application/json');

require_once 'db/db_config.php';

$response = ['success' => false, 'message' => '', 'products' => []];

if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'You must be logged in to view products.';
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
    // Get seller's products
    $stmt = $conn->prepare("
        SELECT p_id, p_title, p_price, p_image, p_total_sold, p_createdat
        FROM products
        WHERE seller_id = ?
        ORDER BY p_createdat DESC
    ");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = [
            'p_id' => $row['p_id'],
            'p_title' => $row['p_title'],
            'p_price' => $row['p_price'],
            'p_image' => $row['p_image'],
            'p_total_sold' => $row['p_total_sold'],
            'p_createdat' => $row['p_createdat']
        ];
    }
    $stmt->close();

    $response['success'] = true;
    $response['products'] = $products;

} catch (Exception $e) {
    $response['message'] = 'Error fetching products: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
?>
