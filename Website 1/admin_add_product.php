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
    $seller_id = intval($_POST['seller_id']);
    $title = trim($_POST['title']);
    $price = floatval($_POST['price']);
    $category = trim($_POST['category']);
    $description = trim($_POST['description']);
    $image = trim($_POST['image']);

    if (empty($seller_id) || empty($title) || empty($price)) {
        $response['message'] = 'Seller, title, and price are required';
        echo json_encode($response);
        exit;
    }

    try {
        $stmt = $conn->prepare("
            INSERT INTO products (seller_id, p_title, p_price, p_category, p_description, p_image, p_total_sold) 
            VALUES (?, ?, ?, ?, ?, ?, 0)
        ");
        $stmt->bind_param("isdsss", $seller_id, $title, $price, $category, $description, $image);

        if ($stmt->execute()) {
            // Update seller's total products
            $update_stmt = $conn->prepare("UPDATE users SET seller_total_products = seller_total_products + 1 WHERE u_id = ?");
            $update_stmt->bind_param("i", $seller_id);
            $update_stmt->execute();
            $update_stmt->close();

            $response['success'] = true;
            $response['message'] = 'Product added successfully';
        } else {
            $response['message'] = 'Failed to add product';
        }

        $stmt->close();
    } catch (Exception $e) {
        $response['message'] = $e->getMessage();
    }
}

$conn->close();
echo json_encode($response);
