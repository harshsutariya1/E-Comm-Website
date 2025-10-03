<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database configuration
require_once 'db/db_config.php';

echo "<h1>Database Connection Test</h1>";

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "<p>Connected to database successfully!</p>";

// Test query
$sql = "SELECT COUNT(*) as total FROM products";
$result = $conn->query($sql);

if ($result) {
    $row = $result->fetch_assoc();
    echo "<p>Total products in database: " . $row['total'] . "</p>";
} else {
    echo "<p>Error querying database: " . $conn->error . "</p>";
}

// Fetch a sample product
$sql = "SELECT * FROM products LIMIT 1";
$result = $conn->query($sql);

if ($result && $result->num_rows > 0) {
    $row = $result->fetch_assoc();
    echo "<h2>Sample Product:</h2>";
    echo "<pre>" . print_r($row, true) . "</pre>";
} else {
    echo "<p>No products found in database.</p>";
}

$conn->close();
?>
