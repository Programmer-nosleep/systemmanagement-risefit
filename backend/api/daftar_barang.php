<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../config/db.php';

$query = "SELECT nama_barang, kategori, stok, harga FROM inventori ORDER BY nama_barang ASC";
$result = $conn->query($query);

$inventory = [];
while ($row = $result->fetch_assoc()) {
    $inventory[] = $row;
}

echo json_encode($inventory);
?>
