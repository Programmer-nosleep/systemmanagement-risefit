<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Metode tidak diizinkan"]);
    exit();
}

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/midtrans/midtrans-php/Midtrans.php';

// Konfigurasi Midtrans
\Midtrans\Config::$serverKey = 'YOUR-SERVER-KEY';
\Midtrans\Config::$isProduction = false;
\Midtrans\Config::$isSanitized = true;
\Midtrans\Config::$is3ds = true;

$data = json_decode(file_get_contents("php://input"), true);

$nama_barang = $data['nama_barang'] ?? '';
$harga = $data['harga'] ?? 0;
$metode = $data['metode'] ?? '';

if (!$nama_barang || !$harga || !$metode) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
    exit();
}

// Generate order ID unik
$order_id = 'RISEFIT-' . time();

// Parameter transaksi Midtrans
$transaction_details = array(
    'order_id' => $order_id,
    'gross_amount' => $harga
);

$item_details = array(
    array(
        'id' => 'item1',
        'price' => $harga,
        'quantity' => 1,
        'name' => $nama_barang
    )
);

$transaction = array(
    'transaction_details' => $transaction_details,
    'item_details' => $item_details
);

try {
    // Dapatkan token transaksi dari Midtrans
    $snapToken = \Midtrans\Snap::getSnapToken($transaction);

    // Simpan data transaksi ke database
    $query = "INSERT INTO payments (order_id, nama_barang, harga, metode_pembayaran, snap_token, tanggal)
              VALUES (?, ?, ?, ?, ?, NOW())";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssiss", $order_id, $nama_barang, $harga, $metode, $snapToken);

    if (!$stmt->execute()) {
        throw new Exception("Gagal menyimpan transaksi");
    }

    echo json_encode([
        "status" => "success",
        "snap_token" => $snapToken,
        "order_id" => $order_id
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Gagal memproses transaksi: " . $e->getMessage()
    ]);
}
