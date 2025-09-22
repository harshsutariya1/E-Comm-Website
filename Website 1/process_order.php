<?php
session_start();
header('Content-Type: application/json');

require_once 'db/db_config.php';

$response = ['success' => false, 'message' => 'An error occurred.', 'order_id' => null];

if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'You must be logged in to place an order.';
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_id = $_SESSION['user_id'];
    $cart_items = json_decode($_POST['cart_items'], true);

    if (empty($cart_items)) {
        $response['message'] = 'Your cart is empty.';
        echo json_encode($response);
        exit;
    }

    $conn->begin_transaction();

    try {
        $order_ids = [];

        foreach ($cart_items as $item) {
            // Get product details
            $stmt = $conn->prepare("SELECT seller_id FROM products WHERE p_id = ?");
            $stmt->bind_param("i", $item['id']);
            $stmt->execute();
            $result = $stmt->get_result();
            $product = $result->fetch_assoc();
            $stmt->close();

            if (!$product) {
                throw new Exception("Product not found: " . $item['id']);
            }

            // Insert order
            $stmt = $conn->prepare("INSERT INTO orders (p_id, p_price, seller_id, buyer_id) VALUES (?, ?, ?, ?)");
            $price = floatval(str_replace('$', '', $item['price']));
            $stmt->bind_param("idii", $item['id'], $price, $product['seller_id'], $user_id);
            $stmt->execute();
            $order_id = $conn->insert_id;
            $order_ids[] = $order_id;
            $stmt->close();

            // Update product total sold
            $stmt = $conn->prepare("UPDATE products SET p_total_sold = p_total_sold + ? WHERE p_id = ?");
            $stmt->bind_param("ii", $item['quantity'], $item['id']);
            $stmt->execute();
            $stmt->close();

            // Update seller total sells
            $stmt = $conn->prepare("UPDATE users SET seller_total_sells = seller_total_sells + ? WHERE u_id = ?");
            $stmt->bind_param("ii", $item['quantity'], $product['seller_id']);
            $stmt->execute();
            $stmt->close();
        }

        // Update user total orders
        $stmt = $conn->prepare("UPDATE users SET total_user_orders = total_user_orders + 1 WHERE u_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->close();

        $conn->commit();

        $response['success'] = true;
        $response['message'] = 'Order placed successfully!';
        $response['order_ids'] = $order_ids;

    } catch (Exception $e) {
        $conn->rollback();
        $response['message'] = 'Failed to place order: ' . $e->getMessage();
    }

    $conn->close();
    echo json_encode($response);
} else {
    $response['message'] = 'Invalid request method.';
    echo json_encode($response);
}
?>
