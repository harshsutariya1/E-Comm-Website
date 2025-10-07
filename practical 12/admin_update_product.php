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
    $title = trim($_POST['title']);
    $price = floatval($_POST['price']);
    $category = trim($_POST['category']);
    $description = trim($_POST['description']);
    $image = trim($_POST['image']);

    try {
        $stmt = $conn->prepare("
            UPDATE products 
            SET p_title = ?, p_price = ?, p_category = ?, p_description = ?, p_image = ? 
            WHERE p_id = ?
        ");
        $stmt->bind_param("sdsssi", $title, $price, $category, $description, $image, $product_id);

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Product updated successfully';
        } else {
            $response['message'] = 'Failed to update product';
        }

        $stmt->close();
    } catch (Exception $e) {
        $response['message'] = $e->getMessage();
    }
}

$conn->close();
echo json_encode($response);
