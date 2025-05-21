<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

session_start();
if (session_id()) {
    session_destroy();
}

$_SESSION = [];

setcookie("token", "", [
    "expires" => time() + 3600,
    "path" => "/",
    "domain" => "localhost",
    "secure" => false,
    "httponly" => true,
    "samesite" => "Lax"
]);

setcookie("PHPSESSID", "", time() - 3600, "/");

echo json_encode(["result" => "Logged out successfully!"]);
?>
