<?php
session_start();
header('Content-Type: application/json');

require_once 'db/db_config.php';

$response = ['success' => false, 'message' => ''];

if (!isset($_SESSION['admin_id'])) {
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $product_id = intval($_POST['product_id']);

    try {
        // Get seller_id before deleting
        $get_stmt = $conn->prepare("SELECT seller_id FROM products WHERE p_id = ?");
        $get_stmt->bind_param("i", $product_id);
        $get_stmt->execute();
        $result = $get_stmt->get_result();
        $product = $result->fetch_assoc();
        $get_stmt->close();

        if ($product) {
            $seller_id = $product['seller_id'];

            // Delete product
            $stmt = $conn->prepare("DELETE FROM products WHERE p_id = ?");
            $stmt->bind_param("i", $product_id);

            if ($stmt->execute()) {
                // Update seller's total products
                $update_stmt = $conn->prepare("UPDATE users SET seller_total_products = GREATEST(seller_total_products - 1, 0) WHERE u_id = ?");
                $update_stmt->bind_param("i", $seller_id);
                $update_stmt->execute();
                $update_stmt->close();

                $response['success'] = true;
                $response['message'] = 'Product deleted successfully';
            } else {
                $response['message'] = 'Failed to delete product';
            }

            $stmt->close();
        } else {
            $response['message'] = 'Product not found';
        }
    } catch (Exception $e) {
        $response['message'] = $e->getMessage();
    }
}

$conn->close();
echo json_encode($response);
