<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

// Pastikan session berjalan
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Cek apakah user sudah login
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'User not logged in']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Cek apakah user sudah terdaftar sebagai member
$query_member = "SELECT id FROM members WHERE user_id = ?";
$stmt_member = $conn->prepare($query_member);
$stmt_member->bind_param("i", $user_id);
$stmt_member->execute();
$result_member = $stmt_member->get_result();
$member = $result_member->fetch_assoc();

$membership = null;

if ($member) {
    $query_membership = "SELECT mem.tanggal_mulai, mem.tanggal_akhir, mem.status, mem.paket 
                         FROM membership mem 
                         WHERE mem.member_id = ?";
    $stmt_membership = $conn->prepare($query_membership);
    $stmt_membership->bind_param("i", $member['id']);
    $stmt_membership->execute();
    $result_membership = $stmt_membership->get_result();
    $membership = $result_membership->fetch_assoc();
}

// Ambil data kelas yang bisa dibooking
$query_kelas = "SELECT id, nama_kelas, jadwal, slot_tersedia FROM kelas ORDER BY jadwal ASC";
$result_kelas = $conn->query($query_kelas);
$kelas = $result_kelas->fetch_all(MYSQLI_ASSOC);

// Gabungkan semua data
$data = [
    'member' => $member,
    'membership' => $membership,
    'kelas' => $kelas
];



// Kirim sebagai JSON
echo json_encode($data);
