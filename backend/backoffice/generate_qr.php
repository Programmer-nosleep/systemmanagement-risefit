<?php
require '../includes/config.php';
require '../includes/phpqrcode/qrlib.php';

// Pastikan admin yang mengakses
session_start();
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    die("Akses ditolak!");
}

// Ambil data user (backoffice)
$query = "SELECT id, nama FROM users WHERE role = 'backoffice'";
$result = $conn->query($query);

while ($row = $result->fetch_assoc()) {
    $user_id = $row['id'];
    $nama = $row['nama'];
    $qr_data = "http://localhost/risefit_db2/scan_qris.php?user_id=$user_id";
    
    // Simpan QR Code
    $filename = "../assets/qrcodes/user_$user_id.png";
    QRcode::png($qr_data, $filename, QR_ECLEVEL_L, 10, 2);

    echo "<p>$nama</p>";
    echo "<img src='$filename' alt='QR Code'>";
}
?>
