<?php
// Prevent any output before JSON
ob_start();

session_start();
header('Content-Type: application/json');

require_once 'db/db_config.php';

$response = ['success' => false, 'message' => 'An error occurred.'];

if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'You must be logged in to become a seller.';
    ob_end_clean();
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];

    // Check if user is already a seller
    $stmt = $conn->prepare("SELECT is_seller FROM users WHERE u_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if ($user['is_seller'] == 1) {
        $response['message'] = 'You are already registered as a seller.';
        ob_end_clean();
        echo json_encode($response);
        exit;
    }

    // Get form data
    $storeName = trim($_POST['storeName']);
    $storeCategory = trim($_POST['storeCategory']);
    $address = trim($_POST['businessAddress']);
    $phoneNumber = trim($_POST['contactPhone']);

    // Generate placeholder image URL using first letter of store name
    $firstLetter = strtoupper(substr($storeName, 0, 1));
    $sellerProfilePic = "https://placehold.co/300x300/ff6b35/ffffff?text=" . urlencode($firstLetter) . "&font=roboto";

    try {
        // Update user to be a seller with store information
        $stmt = $conn->prepare("
            UPDATE users 
            SET is_seller = 1, 
                seller_store_name = ?, 
                seller_category = ?,
                seller_profile_pic = ?,
                address = ?,
                phone_number = ?,
                seller_total_products = 0,
                seller_total_sells = 0,
                seller_ratings = 0.00,
                is_seller_active = 1
            WHERE u_id = ?
        ");
        $stmt->bind_param("sssssi", $storeName, $storeCategory, $sellerProfilePic, $address, $phoneNumber, $user_id);
        $stmt->execute();
        $stmt->close();

        $response['success'] = true;
        $response['message'] = 'Congratulations! You are now a seller on ByteBazaar!';
    } catch (Exception $e) {
        $response['message'] = 'Failed to submit application: ' . $e->getMessage();
    }

    $conn->close();
    ob_end_clean();
    echo json_encode($response);
} else {
    $response['message'] = 'Invalid request method.';
    ob_end_clean();
    echo json_encode($response);
}
?>
} else {
$response['message'] = 'Invalid request method.';
echo json_encode($response);
}
?>