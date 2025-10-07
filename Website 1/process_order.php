<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

session_start();
header('Content-Type: application/json');

require_once 'db/db_config.php';

$response = ['success' => false, 'message' => 'An error occurred.', 'order_ids' => []];

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
        $total_quantity_ordered = 0;

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

            // Loop for each quantity of the item to create separate orders
            for ($i = 0; $i < $item['quantity']; $i++) {
                $stmt_order = $conn->prepare("INSERT INTO orders (p_id, p_price, seller_id, buyer_id) VALUES (?, ?, ?, ?)");
                $price = floatval(str_replace('$', '', $item['price']));
                $stmt_order->bind_param("idii", $item['id'], $price, $product['seller_id'], $user_id);
                $stmt_order->execute();
                $order_ids[] = $stmt_order->insert_id;
                $stmt_order->close();
            }

            // Update product total sold (only once per item)
            $stmt_product = $conn->prepare("UPDATE products SET p_total_sold = p_total_sold + ? WHERE p_id = ?");
            $stmt_product->bind_param("ii", $item['quantity'], $item['id']);
            $stmt_product->execute();
            $stmt_product->close();

            // Update seller total sells (only once per item)
            $stmt_seller = $conn->prepare("UPDATE users SET seller_total_sells = seller_total_sells + ? WHERE u_id = ?");
            $stmt_seller->bind_param("ii", $item['quantity'], $product['seller_id']);
            $stmt_seller->execute();
            $stmt_seller->close();

            // Add the quantity of this item to the total
            $total_quantity_ordered += $item['quantity'];
        }

        // Update user total orders by the total quantity of all items
        $stmt_user = $conn->prepare("UPDATE users SET total_user_orders = total_user_orders + ? WHERE u_id = ?");
        $stmt_user->bind_param("ii", $total_quantity_ordered, $user_id);
        $stmt_user->execute();
        $stmt_user->close();

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