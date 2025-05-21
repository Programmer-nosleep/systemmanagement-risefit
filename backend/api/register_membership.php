<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/db.php';

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in']);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$paket = $input['paket'] ?? null;
$tanggal_mulai = $input['tanggal_mulai'] ?? null;
$tanggal_akhir = $input['tanggal_akhir'] ?? null;

$user_id = $_SESSION['user_id'];

// Cari member_id
$stmt = $conn->prepare("SELECT id FROM members WHERE user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$member = $result->fetch_assoc();

if (!$member) {
    echo json_encode(['success' => false, 'message' => 'User is not a member']);
    exit();
}

// Simpan membership
$stmt = $conn->prepare("INSERT INTO membership (member_id, paket, tanggal_mulai, tanggal_akhir, status) VALUES (?, ?, ?, ?, 'aktif')");
$stmt->bind_param("isss", $member['id'], $paket, $tanggal_mulai, $tanggal_akhir);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => $stmt->error]);
}
