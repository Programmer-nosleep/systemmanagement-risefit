<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../config/db.php';

// Pastikan session dimulai hanya jika belum dimulai
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Ambil data dari database
$query = "SELECT pesanan.id, pesanan.nama_barang, pesanan.jumlah, pesanan.total_harga, pesanan.created_at, 
                 users.nama AS nama_pembeli 
          FROM pesanan 
          JOIN users ON pesanan.user_id = users.id
          WHERE pesanan.status = 'Selesai' 
          ORDER BY pesanan.created_at DESC";
$stmt = $conn->prepare($query);
$stmt->execute();
$result = $stmt->get_result();

// Ambil data dalam bentuk array
$orders = [];
while ($row = $result->fetch_assoc()) {
    $orders[] = $row;
}

// Hitung total harga semua pesanan selesai
$query_total = "SELECT SUM(total_harga) AS total_semua FROM pesanan WHERE status = 'Selesai'";
$result_total = $conn->query($query_total);
$total_semua = $result_total->fetch_assoc()['total_semua'] ?? 0;

// Kirim data dalam format JSON
echo json_encode([
    'orders' => $orders,
    'total_semua' => $total_semua
]);
?>
