<?php
session_start();
header('Content-Type: application/json');

// Include database config
require_once 'db/db_config.php';

$response = ['logged_in' => false];

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    // Fetch full user data from database
    $stmt = $conn->prepare("SELECT u_id, first_name, last_name, email, is_seller, seller_store_name, seller_profile_pic, user_profile_pic, seller_category, seller_ratings, seller_total_products, seller_total_sells, created_at, updated_at FROM users WHERE u_id = ? AND is_user_active = 1");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        $response['logged_in'] = true;
        $response['user'] = $user;
    }

    $stmt->close();
}

$conn->close();
echo json_encode($response);
?>
