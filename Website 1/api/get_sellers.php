<?php
header('Content-Type: application/json');

// Include database config
require_once '../db/db_config.php';

$response = ['success' => false, 'message' => '', 'sellers' => []];

try {
    // Query to get all active sellers
    $stmt = $conn->prepare("SELECT u_id, first_name, last_name, email, seller_store_name, seller_profile_pic, seller_category, seller_ratings, seller_total_products, seller_total_sells, created_at FROM users WHERE is_seller = 1 AND is_seller_active = 1 ORDER BY seller_ratings DESC, seller_total_sells DESC");
    $stmt->execute();
    $result = $stmt->get_result();

    $sellers = [];
    while ($row = $result->fetch_assoc()) {
        $sellers[] = [
            'id' => $row['u_id'],
            'first_name' => $row['first_name'],
            'last_name' => $row['last_name'],
            'email' => $row['email'],
            'store_name' => $row['seller_store_name'] ?: ($row['first_name'] . ' ' . $row['last_name'] . ' Store'),
            // 'profile_pic' => $row['seller_profile_pic'] ? : 'https://placehold.co/80x80/ff9771/ffffff?text=' . urlencode(substr($row['first_name'], 0, 1) . substr($row['last_name'], 0, 1)),
            'profile_pic' =>  'https://placehold.co/80x80/ff9771/ffffff?text=' . urlencode(substr($row['first_name'], 0, 1) . substr($row['last_name'], 0, 1)),
            'category' => $row['seller_category'] ?: 'General',
            'rating' => (float) $row['seller_ratings'],
            'total_products' => (int) $row['seller_total_products'],
            'total_sales' => (int) $row['seller_total_sells'],
            'member_since' => $row['created_at']
        ];
    }

    $response['success'] = true;
    $response['sellers'] = $sellers;
    $response['message'] = 'Sellers fetched successfully';
} catch (Exception $e) {
    $response['message'] = 'Error fetching sellers: ' . $e->getMessage();
}

$conn->close();
echo json_encode($response);
