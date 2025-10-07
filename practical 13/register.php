<?php
session_start();
header('Content-Type: application/json');

// Include database config
require_once 'db/db_config.php';

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $first_name = trim($_POST['first_name'] ?? '');
    $last_name = trim($_POST['last_name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';

    // Validation
    if (empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($confirm_password)) {
        $response['message'] = 'All fields are required.';
        echo json_encode($response);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Invalid email format.';
        echo json_encode($response);
        exit;
    }

    if (strlen($password) < 8 || !preg_match('/[a-z]/', $password) || !preg_match('/[A-Z]/', $password) || !preg_match('/\d/', $password)) {
        $response['message'] = 'Password must be at least 8 characters with uppercase, lowercase, and number.';
        echo json_encode($response);
        exit;
    }

    if ($password !== $confirm_password) {
        $response['message'] = 'Passwords do not match.';
        echo json_encode($response);
        exit;
    }

    // Check if email exists
    $stmt = $conn->prepare("SELECT u_id FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    if ($result->num_rows > 0) {
        $response['message'] = 'Email already registered.';
        $stmt->close();
        echo json_encode($response);
        exit;
    }
    $stmt->close();

    // Hash password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Insert user
    $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $first_name, $last_name, $email, $hashed_password);
    if ($stmt->execute()) {
        // Start session for the new user
        $user_id = $stmt->insert_id;
        $_SESSION['user_id'] = $user_id;
        $_SESSION['first_name'] = $first_name;
        $_SESSION['last_name'] = $last_name;
        $_SESSION['email'] = $email;
        $_SESSION['is_seller'] = false; // Default for new users

        $response['success'] = true;
        $response['message'] = 'Registration successful!';

        // --- Data Preparation for file writing ---
        $file_path = 'registrations.csv';
        $new_record = [$first_name, $last_name, $email, date('Y-m-d H:i:s')];

        // --- File Writing ---
        // Open the file in "append" mode
        $file_handle = fopen($file_path, 'a');
        if ($file_handle !== false) {
            // Write the new record as a CSV line
            fputcsv($file_handle, $new_record);
            // Close the file
            fclose($file_handle);
        } else {
            // Handle file open error
            error_log("Could not open the file for writing: " . $file_path);
        }
    } else {
        $response['message'] = 'Registration failed. Please try again.';
    }
    $stmt->close();
} else {
    $response['message'] = 'Invalid request method.';
}

$conn->close();
echo json_encode($response);
