<?php
// Enable error reporting for debugging (remove in production)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database configuration
require_once 'db/db_config.php';

// Set header to return JSON
header('Content-Type: application/json');

// Initialize response array
$response = array('success' => false, 'products' => array(), 'message' => '');

try {
    // Log the request for debugging
    error_log("get_products.php called at " . date('Y-m-d H:i:s'));
    
    // Check if database connection is successful
    if ($conn->connect_error) {
        $response['message'] = 'Database connection failed: ' . $conn->connect_error;
        error_log($response['message']);
        echo json_encode($response);
        exit;
    }
    
    // Prepare SQL query to fetch all products
    $sql = "SELECT id, product_sku, title, price, rating, image, category, badge, description, date_added FROM products ORDER BY date_added DESC";
    
    // Execute the query
    $result = $conn->query($sql);
    
    if ($result) {
        // Fetch all products
        $products = array();
        while ($row = $result->fetch_assoc()) {
            $products[] = array(
                'id' => $row['product_sku'], // Use product_sku as id for consistency
                'title' => $row['title'],
                'price' => '$' . number_format($row['price'], 2),
                'rating' => (float)$row['rating'],
                'image' => $row['image'],
                'category' => $row['category'],
                'badge' => $row['badge'],
                'description' => $row['description']
            );
        }
        
        $response['success'] = true;
        $response['products'] = $products;
        $response['message'] = 'Products fetched successfully';
        error_log("Successfully fetched " . count($products) . " products");
    } else {
        $response['message'] = 'Failed to fetch products: ' . $conn->error;
        error_log($response['message']);
    }
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
    error_log('Exception in get_products.php: ' . $e->getMessage());
}

// Close the database connection
$conn->close();

// Return JSON response
echo json_encode($response);
?>
