<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../config/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

$eData = file_get_contents("php://input");
$dData = json_decode($eData, true);

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nama = trim($dData['nama'] ?? '');
    $username = trim($dData['username'] ?? '');
    $email = trim($dData['email'] ?? '');
    $password = trim($dData['password'] ?? '');

    if (empty($nama) || empty($username) || empty($email) || empty($password)) {
        echo json_encode(["error" => "Semua field harus diisi!"]);
        http_response_code(400);
        exit();
    }

    $check_user = $conn->prepare("SELECT id FROM users WHERE username = ?");
    $check_user->bind_param("s", $username);
    $check_user->execute();
    $result = $check_user->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(["error" => "Username sudah digunakan!"]);
        http_response_code(400);
        exit();
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $conn->prepare("INSERT INTO users (nama, username, email, password) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $nama, $username, $email, $hashed_password);

    if ($stmt->execute()) {
        echo json_encode(["success" => "Registrasi berhasil, silakan login!"]);
        http_response_code(201);
    } else {
        echo json_encode(["error" => "Terjadi kesalahan saat registrasi!", "details" => $stmt->error]);
        http_response_code(500);
    }
}

$conn->close();
?>