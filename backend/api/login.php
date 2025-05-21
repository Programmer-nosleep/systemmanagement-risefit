<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

session_start();
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "RAHASIA_JWT_YANG_PANJANG_DAN_ACAK";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = filter_var($data['username'], FILTER_SANITIZE_STRING);
    $password = $data['password'];

    if (!empty($username) && !empty($password)) {
        $stmt = $conn->prepare("SELECT id, username, password, role FROM users WHERE username = ?");
        if ($stmt) {
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 1) {
                $row = $result->fetch_assoc();

                if (password_verify($password, $row['password'])) {
                    session_regenerate_id(true);
                    $_SESSION['user_id'] = $row['id'];
                    $_SESSION['username'] = $row['username'];
                    $_SESSION['role'] = $row['role'];
                    
                    $payload = [
                        "id" => $row['id'],
                        "username" => $row['username'],
                        "role" => $row['role'],
                        "exp" => time() + 3600
                    ];
                    $jwt = JWT::encode($payload, $secret_key, 'HS256');

                    setcookie("token", $jwt, time() + 3600, "/", "localhost", false, true);

                    echo json_encode([
                        "result" => "Login Success",
                        "token" => $jwt,
                        "role" => $row['role']
                    ]);
                    exit();
                } else {
                    echo json_encode(["result" => "Password salah!"]);
                    exit();
                }
            } else {
                echo json_encode(["result" => "Username tidak ditemukan!"]);
                exit();
            }

            $stmt->close();
        } else {
            echo json_encode(["result" => "Query error!"]);
            exit();
        }
    } else {
        echo json_encode(["result" => "Semua kolom harus diisi!"]);
        exit();
    }
}

$conn->close();
?>