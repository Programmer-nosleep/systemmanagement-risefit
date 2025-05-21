<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

require_once __DIR__ . '/../config/db.php';

// Cek jika request OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Cek apakah user_id ada dalam session
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["success" => false, "role" => "Unauthorized"]);
    exit();
}

$user_id = $_SESSION['user_id'];

// Query untuk mengambil data user berdasarkan user_id
$query = "SELECT id_name, username, role, status_message, img FROM users WHERE id = ?";
$stmt = $conn->prepare($query);

if (!$stmt) {
    // Jika query gagal, kirimkan error
    http_response_code(500);
    echo json_encode(["success" => false, "role" => "Database Error"]);
    exit();
}

// Bind parameter untuk user_id
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// Periksa jika data ditemukan
if ($row = $result->fetch_assoc()) {
    // Debug: Periksa data yang diterima
    error_log("Fetched user data: " . print_r($row, true));

    // Base64 encode gambar jika ada
    $imgBase64 = !empty($row['img']) ? base64_encode($row['img']) : null;

    echo json_encode([
        "success" => true,
        "name" => trim($row['id_name']), // Gunakan trim() untuk menghapus spasi ekstra
        "userName" => $row['username'],
        "role" => $row['role'],
        "statusMessage" => $row['status_message'] ?? "",
        "userPhoto" => $imgBase64
    ]);
} else {
    // Jika data tidak ditemukan
    http_response_code(404);
    echo json_encode(["success" => false, "role" => "Not Found"]);
}

$stmt->close();
exit();
?>
