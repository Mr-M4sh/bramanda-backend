<?php
// ===========================
// BRAMANDA - Order Management API
// Handles order submission and retrieval
// ===========================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$request_method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($request_method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// POST: Submit new order
if ($request_method === 'POST' && $action === 'submit_order') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data) {
        echo json_encode(['success' => false, 'error' => 'Invalid request data']);
        exit();
    }

    // Extract customer info
    $name = $conn->real_escape_string($data['name'] ?? '');
    $email = $conn->real_escape_string($data['email'] ?? '');
    $phone = $conn->real_escape_string($data['phone'] ?? '');
    $address = $conn->real_escape_string($data['address'] ?? '');
    $city = $conn->real_escape_string($data['city'] ?? '');
    $state = $conn->real_escape_string($data['state'] ?? '');
    $zip = $conn->real_escape_string($data['zip'] ?? '');
    $payment = $conn->real_escape_string($data['payment'] ?? 'Not Specified');
    $total = floatval($data['total'] ?? 0);
    $items = json_encode($data['items'] ?? []);

    // Validate required fields
    if (empty($name) || empty($email) || empty($address)) {
        echo json_encode(['success' => false, 'error' => 'Missing required fields']);
        exit();
    }

    // Insert order into database
    $sql = "INSERT INTO orders (customer_name, customer_email, customer_phone, shipping_address, city, state, zip_code, payment_method, products, total_amount, order_status)
            VALUES ('$name', '$email', '$phone', '$address', '$city', '$state', '$zip', '$payment', '$items', $total, 'pending')";

    if ($conn->query($sql) === TRUE) {
        $order_id = $conn->insert_id;

        // Update or create customer record
        $check_customer = $conn->query("SELECT id FROM customers WHERE email = '$email'");

        if ($check_customer->num_rows > 0) {
            // Update existing customer
            $conn->query("UPDATE customers SET name='$name', phone='$phone', address='$address', city='$city', state='$state', zip_code='$zip', total_orders = total_orders + 1, total_spent = total_spent + $total WHERE email = '$email'");
        } else {
            // Create new customer
            $conn->query("INSERT INTO customers (email, name, phone, address, city, state, zip_code, total_orders, total_spent)
                        VALUES ('$email', '$name', '$phone', '$address', '$city', '$state', '$zip', 1, $total)");
        }

        echo json_encode([
            'success' => true,
            'message' => 'Order submitted successfully',
            'order_id' => $order_id
        ]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $conn->error]);
    }
    exit();
}

// GET: Retrieve all orders (for admin dashboard)
if ($request_method === 'GET' && $action === 'get_orders') {
    $sql = "SELECT id, customer_name, customer_email, total_amount, order_status, created_at FROM orders ORDER BY created_at DESC LIMIT 100";
    $result = $conn->query($sql);

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode(['success' => true, 'orders' => $orders]);
    exit();
}

// GET: Retrieve order by ID
if ($request_method === 'GET' && $action === 'get_order') {
    $order_id = intval($_GET['order_id'] ?? 0);

    if ($order_id === 0) {
        echo json_encode(['success' => false, 'error' => 'Order ID required']);
        exit();
    }

    $sql = "SELECT * FROM orders WHERE id = $order_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $order = $result->fetch_assoc();
        $order['products'] = json_decode($order['products'], true);
        echo json_encode(['success' => true, 'order' => $order]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Order not found']);
    }
    exit();
}

// GET: Retrieve customer orders by email
if ($request_method === 'GET' && $action === 'get_customer_orders') {
    $email = $conn->real_escape_string($_GET['email'] ?? '');

    if (empty($email)) {
        echo json_encode(['success' => false, 'error' => 'Email required']);
        exit();
    }

    $sql = "SELECT id, total_amount, order_status, created_at FROM orders WHERE customer_email = '$email' ORDER BY created_at DESC";
    $result = $conn->query($sql);

    $orders = [];
    while ($row = $result->fetch_assoc()) {
        $orders[] = $row;
    }

    echo json_encode(['success' => true, 'orders' => $orders]);
    exit();
}

// Default response
echo json_encode(['success' => false, 'error' => 'Invalid action']);
$conn->close();
