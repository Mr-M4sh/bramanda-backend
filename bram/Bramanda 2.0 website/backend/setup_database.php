<?php
// ===========================
// BRAMANDA - Database Setup Script
// Run this ONCE to create all database tables
// ===========================

header('Content-Type: application/json');

require_once 'config.php';

// SQL to create tables
$sql_orders = "CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    products JSON NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    order_status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

$sql_products = "CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    tagline VARCHAR(255),
    stock_quantity INT DEFAULT 999,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

$sql_customers = "CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(10),
    total_orders INT DEFAULT 0,
    total_spent DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)";

$response = [
    'success' => true,
    'messages' => []
];

// Create orders table
if ($conn->query($sql_orders) === TRUE) {
    $response['messages'][] = "✓ Orders table created/verified";
} else {
    $response['messages'][] = "✗ Error creating orders table: " . $conn->error;
    $response['success'] = false;
}

// Create products table
if ($conn->query($sql_products) === TRUE) {
    $response['messages'][] = "✓ Products table created/verified";
} else {
    $response['messages'][] = "✗ Error creating products table: " . $conn->error;
    $response['success'] = false;
}

// Create customers table
if ($conn->query($sql_customers) === TRUE) {
    $response['messages'][] = "✓ Customers table created/verified";
} else {
    $response['messages'][] = "✗ Error creating customers table: " . $conn->error;
    $response['success'] = false;
}

// Insert default products if not exists
$check_products = $conn->query("SELECT COUNT(*) as count FROM products");
$product_count = $check_products->fetch_assoc()['count'];

if ($product_count == 0) {
    $insert_products = "INSERT INTO products (product_code, product_name, price, tagline, description, image_url) VALUES
    ('p1', 'ELFBAR 5000', 699.00, 'RISE FROM ASHES', 'Aerospace-grade aluminum body with haptic feedback engine.', 'https://raw.githubusercontent.com/Mr-M4sh/Bramanda-Official.github.io/refs/heads/main/elf%20triple%20berry.png'),
    ('p2', 'GUAVA OBSIDIAN STEALTH', 699.00, 'UNSEEN POWER', 'Matte black ceramic coating. Zero light leakage. The perfect stealth vape.', 'https://raw.githubusercontent.com/Mr-M4sh/Bramanda-Official.github.io/refs/heads/main/guva.png'),
    ('p3', 'Straw the berry', 699.00, 'PURE VAPOR', 'Glass-lined chamber for unadulterated flavor profiles.', 'https://raw.githubusercontent.com/Mr-M4sh/Bramanda-Official.github.io/refs/heads/main/strawberry%20kiwi.png'),
    ('p4', 'The legendary Apple', 699.00, 'HEART OF FIRE', 'Limited edition red anodized finish. High-discharge battery system.', 'https://raw.githubusercontent.com/Mr-M4sh/Bramanda-Official.github.io/refs/heads/main/sour%20apple.png')";

    if ($conn->query($insert_products) === TRUE) {
        $response['messages'][] = "✓ Default products inserted";
    } else {
        $response['messages'][] = "✗ Error inserting products: " . $conn->error;
    }
}

echo json_encode($response);
$conn->close();
