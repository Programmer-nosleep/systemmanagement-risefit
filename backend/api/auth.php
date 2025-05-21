<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$secret_key = "RAHASIA_JWT_YANG_PANJANG_DAN_ACAK";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

if (!isset($_COOKIE['token'])) {
    echo json_encode(["error" => "Unauthorized"]);
    http_response_code(401);
    exit();
}

$token = $_COOKIE['token'];

try {
    $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));

    echo json_encode([
        "username" => $decoded->username,
        "role" => $decoded->role
    ]);
} catch (Exception $e) {
    echo json_encode(["error" => "Invalid token"]);
    http_response_code(401);
    exit();
}
?>
