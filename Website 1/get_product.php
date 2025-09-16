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
    require_once 'db/db_config.php';
    
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
    $sql = "SELECT id, product_sku, title, price, rating, image, category, badge, description, date_added FROM products WHERE product_sku = ?";
    
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
            'id' => $row['product_sku'],
            'title' => $row['title'],
            'price' => '$' . number_format($row['price'], 2),
            'rating' => (float)$row['rating'],
            'image' => $row['image'],
            'category' => $row['category'],
            'badge' => $row['badge'],
            'description' => $row['description']
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
?>
