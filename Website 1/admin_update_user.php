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
    $user_id = $_POST['user_id'];
    $first_name = trim($_POST['first_name']);
    $last_name = trim($_POST['last_name']);
    $email = trim($_POST['email']);
    $phone_number = trim($_POST['phone_number']);
    $address = trim($_POST['address']);

    try {
        $stmt = $conn->prepare("UPDATE users SET first_name = ?, last_name = ?, email = ?, phone_number = ?, address = ? WHERE u_id = ?");
        $stmt->bind_param("sssssi", $first_name, $last_name, $email, $phone_number, $address, $user_id);
        $stmt->execute();
        $stmt->close();

        $response['success'] = true;
        $response['message'] = 'User updated successfully';
    } catch (Exception $e) {
        $response['message'] = $e->getMessage();
    }
}

$conn->close();
echo json_encode($response);
