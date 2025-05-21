<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../vendor/autoload.php';

session_start();
if (!isset($_SESSION['role'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$sql_admin = "SELECT COUNT(*) AS total_admin FROM users WHERE role='admin'";
$sql_finance = "SELECT COUNT(*) AS total_finance FROM finance_transactions";
$sql_purchasing = "SELECT COUNT(*) AS total_purchasing FROM purchasing";

$result_admin = $conn->query($sql_admin)->fetch_assoc();
$result_finance = $conn->query($sql_finance)->fetch_assoc();
$result_purchasing = $conn->query($sql_purchasing)->fetch_assoc();

$sql_admin_users = "SELECT id, username, role FROM users WHERE role='admin'";
$sql_regular_users = "SELECT id, username, role FROM users WHERE role='user'";
$sql_backoffice_users = "SELECT id, username, role FROM users WHERE role='backoffice'";

$result_admin_users = $conn->query($sql_admin_users)->fetch_all(MYSQLI_ASSOC);
$result_regular_users = $conn->query($sql_regular_users)->fetch_all(MYSQLI_ASSOC);
$result_backoffice_users = $conn->query($sql_backoffice_users)->fetch_all(MYSQLI_ASSOC);

echo json_encode([
    'total_admin' => (int)$result_admin['total_admin'],
    'total_finance' => (int)$result_finance['total_finance'],
    'total_purchasing' => (int)$result_purchasing['total_purchasing'],
    'admin_users' => $result_admin_users,
    'regular_users' => $result_regular_users,
    'backoffice_users' => $result_backoffice_users
]);
