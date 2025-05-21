<?php
require '../includes/config.php';
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['username']) || ($_SESSION['role'] !== 'admin' && $_SESSION['role'] !== 'backoffice')) {
    header("Location: ../auth/login.php");
    exit();
}

$id = $_GET['id'];
$query = "DELETE FROM purchasing WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    header("Location: purchasing.php");
} else {
    echo "Gagal menghapus data!";
}
?>
