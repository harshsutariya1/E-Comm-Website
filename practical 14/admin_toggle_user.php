<?php
session_start();
header('Content-Type: application/json');

require_once 'db/db_config.php';

$response = ['success' => false, 'message' => ''];

if (!isset($_SESSION['admin_id'])) {
    $response['message'] = 'Unauthorized access';
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = intval($_POST['user_id']);
    $status = intval($_POST['status']);

    // Validate status value (0 or 1)
    if ($status !== 0 && $status !== 1) {
        $response['message'] = 'Invalid status value';
        echo json_encode($response);
        exit;
    }

    try {
        $stmt = $conn->prepare("UPDATE users SET is_user_active = ? WHERE u_id = ?");
        $stmt->bind_param("ii", $status, $user_id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $response['success'] = true;
                $response['message'] = 'User status updated successfully';
            } else {
                $response['message'] = 'User not found or status unchanged';
            }
        } else {
            $response['message'] = 'Failed to update user status';
        }

        $stmt->close();
    } catch (Exception $e) {
        $response['message'] = 'Error: ' . $e->getMessage();
    }
}

$conn->close();
echo json_encode($response);
