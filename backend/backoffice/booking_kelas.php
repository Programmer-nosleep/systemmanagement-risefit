<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../config/db.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Unauthorized"]);
    exit();
}

$user_id = $_SESSION['user_id'];

// Cek membership
$query_member = "SELECT id FROM members WHERE user_id = ?";
$stmt_member = $conn->prepare($query_member);
$stmt_member->bind_param("i", $user_id);
$stmt_member->execute();
$result_member = $stmt_member->get_result();
$member = $result_member->fetch_assoc();

if (!$member) {
    http_response_code(403);
    echo json_encode(["error" => "Belum punya membership"]);
    exit();
}

$member_id = $member['id'];

if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $query_kelas = "SELECT * FROM kelas WHERE slot_tersedia > 0 ORDER BY jadwal ASC";
    $result_kelas = $conn->query($query_kelas);
    $kelas_data = [];
    while ($row = $result_kelas->fetch_assoc()) {
        $kelas_data[] = $row;
    }
    echo json_encode($kelas_data);
} 

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $kelas_id = $data['kelas_id'];

    $query_update_slot = "UPDATE kelas SET slot_tersedia = slot_tersedia - 1 WHERE id = ? AND slot_tersedia > 0";
    $stmt_update = $conn->prepare($query_update_slot);
    $stmt_update->bind_param("i", $kelas_id);

    if ($stmt_update->execute()) {
        $query_booking = "INSERT INTO booking_kelas (member_id, kelas_id) VALUES (?, ?)";
        $stmt_booking = $conn->prepare($query_booking);
        $stmt_booking->bind_param("ii", $member_id, $kelas_id);
        $stmt_booking->execute();

        echo json_encode(["success" => true, "message" => "Berhasil booking kelas!"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Gagal booking kelas."]);
    }
}
?>
