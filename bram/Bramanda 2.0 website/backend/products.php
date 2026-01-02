<?php
// ===========================
// BRAMANDA - Products API
// Handles product retrieval and management
// ===========================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'config.php';

$request_method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

if ($request_method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// GET: Retrieve all products
if ($request_method === 'GET' && $action === 'get_products') {
    $sql = "SELECT id, product_code, product_name, price, description, image_url, tagline FROM products ORDER BY created_at DESC";
    $result = $conn->query($sql);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode(['success' => true, 'products' => $products]);
    exit();
}

// GET: Get product by ID
if ($request_method === 'GET' && $action === 'get_product') {
    $product_id = intval($_GET['product_id'] ?? 0);

    if ($product_id === 0) {
        echo json_encode(['success' => false, 'error' => 'Product ID required']);
        exit();
    }

    $sql = "SELECT * FROM products WHERE id = $product_id";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $product = $result->fetch_assoc();
        echo json_encode(['success' => true, 'product' => $product]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Product not found']);
    }
    exit();
}

// GET: Search products
if ($request_method === 'GET' && $action === 'search_products') {
    $search = $conn->real_escape_string($_GET['query'] ?? '');

    if (empty($search)) {
        echo json_encode(['success' => false, 'error' => 'Search query required']);
        exit();
    }

    $sql = "SELECT * FROM products WHERE product_name LIKE '%$search%' OR description LIKE '%$search%' LIMIT 20";
    $result = $conn->query($sql);

    $products = [];
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }

    echo json_encode(['success' => true, 'products' => $products, 'count' => count($products)]);
    exit();
}

// POST: Add new product (Admin)
if ($request_method === 'POST' && $action === 'add_product') {
    $data = json_decode(file_get_contents('php://input'), true);

    $product_code = $conn->real_escape_string($data['product_code'] ?? '');
    $product_name = $conn->real_escape_string($data['product_name'] ?? '');
    $price = floatval($data['price'] ?? 0);
    $description = $conn->real_escape_string($data['description'] ?? '');
    $image_url = $conn->real_escape_string($data['image_url'] ?? '');
    $tagline = $conn->real_escape_string($data['tagline'] ?? '');

    if (empty($product_code) || empty($product_name) || $price <= 0) {
        echo json_encode(['success' => false, 'error' => 'Invalid product data']);
        exit();
    }

    $sql = "INSERT INTO products (product_code, product_name, price, description, image_url, tagline)
            VALUES ('$product_code', '$product_name', $price, '$description', '$image_url', '$tagline')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(['success' => true, 'message' => 'Product added successfully', 'product_id' => $conn->insert_id]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Database error: ' . $conn->error]);
    }
    exit();
}

// Default response
echo json_encode(['success' => false, 'error' => 'Invalid action']);
$conn->close();
