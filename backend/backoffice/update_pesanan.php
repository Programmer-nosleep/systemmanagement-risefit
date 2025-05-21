<?php
require '../includes/config.php';
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'backoffice') {
    header("Location: ../login.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $id = $_POST['id'];
    $status = $_POST['status'];

    $query = "UPDATE pesanan SET status = ? WHERE id = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("si", $status, $id);
    $stmt->execute();

    header("Location: pesanan.php");
    exit();
}
?>
