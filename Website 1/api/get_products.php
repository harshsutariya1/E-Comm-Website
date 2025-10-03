<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set header to return JSON
header('Content-Type: application/json');

// Initialize response array
$response = array('success' => false, 'products' => array(), 'message' => '');

try {
    // Include the database configuration
    require_once '../db/db_config.php';

    // Log the request for debugging
    error_log("get_products.php called at " . date('Y-m-d H:i:s'));

    // Check if database connection is successful
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    // Prepare SQL query to fetch all products
    $sql = "SELECT p_id, p_title, p_price, p_description, p_image, p_category, p_badge, p_total_ratings, seller_id, p_total_sold, p_createdat, p_updatedat FROM products ORDER BY p_createdat DESC";

    // Execute the query
    $result = $conn->query($sql);

    if ($result) {
        // Fetch all products
        $products = array();
        while ($row = $result->fetch_assoc()) {
            $products[] = array(
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
        }

        $response['success'] = true;
        $response['products'] = $products;
        $response['message'] = 'Products fetched successfully';
        error_log("Successfully fetched " . count($products) . " products");
    } else {
        throw new Exception('Failed to fetch products: ' . $conn->error);
    }

    // Close the database connection
    $conn->close();
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
    error_log('Exception in get_products.php: ' . $e->getMessage());
}

// Always return JSON response
echo json_encode($response);
