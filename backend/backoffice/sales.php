<?php
require '../includes/config.php';
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (isset($_SESSION['role'])) {
    if ($_SESSION['role'] === 'admin') {
        $dashboard_link = "../backoffice/dashboard_admin.php";
    } elseif ($_SESSION['role'] === 'backoffice') {
        $dashboard_link = "../backoffice/dashboard.php";
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Sales & Marketing</title>
    <link rel="stylesheet" href="../assets/css/style.css"> <!-- Tambahkan ini -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
</head>
<style>
           /* Header */
           h2 {
        text-align: center;
        margin-bottom: 20px;
        color:rgb(9, 68, 231);
    }  
</style>
<body>
    <div class="container mt-4">
        <h2>Sales & Marketing</h2>
        <nav class="mb-3">
        <a href="../backoffice/admin_finance.php" class="btn btn-secondary">Finance</a>
        <a href="../backoffice/purchasing.php" class="btn btn-primary">Purchasing</a>
        <a href="../backoffice/sales.php" class="btn btn-secondary">Sales</a>
        <a href="../backoffice/accounting.php" class="btn btn-secondary">Accounting</a>
        <a href="../backoffice/inventori.php" class="btn btn-secondary">Inventori</a>
        <a href="<?= $dashboard_link; ?>" class="btn btn-info">Dashboard</a>
        <a href="../auth/logout.php" class="btn btn-danger">Logout</a>
    </nav>
        <hr>
        <table class="table">
            <thead>
                <tr>
                    <th>No</th>
                    <th>Produk</th>
                    <th>Jumlah Terjual</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr><td>1</td><td>Paket Gym Premium</td><td>10</td><td>Rp 10.000.000</td></tr>
            </tbody>
        </table>
    </div>
</body>
</html>
