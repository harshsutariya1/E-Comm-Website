<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set header to return JSON
header('Content-Type: application/json');

// Initialize response array
$response = array('success' => false, 'product' => null, 'message' => '');

try {
    // Include the database configuration
    require_once '../db/db_config.php';

    // Check if product ID is provided
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        throw new Exception('Product ID is required');
    }

    $productId = trim($_GET['id']);

    // Log the request for debugging
    error_log("get_product.php called for product ID: " . $productId);

    // Check if database connection is successful
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    // Prepare SQL query to fetch the specific product
    $sql = "SELECT p_id, p_title, p_price, p_description, p_image, p_category, p_badge, p_total_ratings, seller_id, p_total_sold, p_createdat, p_updatedat FROM products WHERE p_id = ?";

    // Prepare and execute the statement
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        throw new Exception('Failed to prepare statement: ' . $conn->error);
    }

    $stmt->bind_param("s", $productId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $row = $result->fetch_assoc();

        $product = array(
            'id' => $row['p_id'],
            'title' => $row['p_title'],
            'price' => '$' . number_format($row['p_price'], 2),
            'description' => $row['p_description'],
            'image' => $row['p_image'],
            'category' => $row['p_category'],
            'badge' => $row['p_badge'],
            'rating' => (float)$row['p_total_ratings'],
            'seller_id' => $row['seller_id'],
            'total_sold' => (int)$row['p_total_sold'],
            'created_at' => $row['p_createdat'],
            'updated_at' => $row['p_updatedat']
        );

        $response['success'] = true;
        $response['product'] = $product;
        $response['message'] = 'Product fetched successfully';
        error_log("Successfully fetched product: " . $product['title']);
    } else {
        throw new Exception('Product not found');
    }

    // Close the statement and connection
    $stmt->close();
    $conn->close();
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
    error_log('Exception in get_product.php: ' . $e->getMessage());
}

// Always return JSON response
echo json_encode($response);
