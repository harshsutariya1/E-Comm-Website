<?php
// Set header to return JSON
header('Content-Type: application/json');

// Initialize response array
$response = array('success' => false, 'categories' => array(), 'message' => '');

try {
    // Include the database configuration
    require_once '../db/db_config.php';

    // Check if database connection is successful
    if ($conn->connect_error) {
        throw new Exception('Database connection failed: ' . $conn->connect_error);
    }

    // Prepare SQL query to fetch all categories
    $sql = "SELECT c_id, name, description, image, icon_class, products_count FROM categories ORDER BY name ASC";

    // Execute the query
    $result = $conn->query($sql);

    if ($result) {
        // Fetch all categories
        $categories = array();
        while ($row = $result->fetch_assoc()) {
            $categories[] = array(
                'c_id' => (int)$row['c_id'],
                'name' => $row['name'],
                'description' => $row['description'],
                'image' => $row['image'],
                'icon_class' => $row['icon_class'],
                'products_count' => (int)$row['products_count']
            );
        }

        $response['success'] = true;
        $response['categories'] = $categories;
        $response['message'] = 'Categories fetched successfully';
        error_log("Successfully fetched " . count($categories) . " categories");
    } else {
        throw new Exception('Failed to fetch categories: ' . $conn->error);
    }

    // Close the database connection
    $conn->close();
} catch (Exception $e) {
    $response['message'] = 'Error: ' . $e->getMessage();
    error_log('Exception in get_categories.php: ' . $e->getMessage());
}

// Always return JSON response
echo json_encode($response);
