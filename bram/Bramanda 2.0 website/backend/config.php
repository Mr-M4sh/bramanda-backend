<?php
// ===========================
// BRAMANDA - MySQL Configuration
// ===========================
// Database credentials for InfinityFree
// Update these with your actual database name once created

$servername = "sql100.infinityfree.com";
$username = "if0_40589405";
$password = "XXXXX_REPLACE_WITH_YOUR_PASSWORD_XXXXX"; // Replace this with your actual password
$dbname = "if0_40589405_bramanda"; // Replace XXX with your actual database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'error' => 'Database connection failed: ' . $conn->connect_error
    ]));
}

// Set charset to UTF-8
$conn->set_charset("utf8");
