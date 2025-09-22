<?php
session_start();
header('Content-Type: application/json');

// Include database config
require_once 'db/db_config.php';

$response = ['logged_in' => false];

if (isset($_SESSION['user_id'])) {
    $user_id = $_SESSION['user_id'];

    // Fetch full user data from database
    $stmt = $conn->prepare("SELECT u_id, first_name, last_name, email, is_seller, address, phone_number, created_at FROM users WHERE u_id = ? AND is_user_active = 1");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        $response['logged_in'] = true;
        $response['user'] = $user;
    } else {
        // If user not found, destroy session
        session_destroy();
    }

    $stmt->close();
}

$conn->close();
echo json_encode($response);
?>
