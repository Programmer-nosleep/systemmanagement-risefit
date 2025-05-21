<?php
require '../includes/config.php';
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
if (!isset($_SESSION['user_id']) || ($_SESSION['role'] !== 'admin' && $_SESSION['role'] !== 'backoffice')) {
    header("Location: ../auth/login.php");
    exit();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama_barang = $_POST['nama_barang'];
    $harga = $_POST['harga'];
    $supplier = $_POST['supplier'];
    $tanggal_pembelian = $_POST['tanggal_pembelian'];

    $stmt = $conn->prepare("INSERT INTO purchasing (nama_barang, harga, supplier, tanggal_pembelian) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sdss", $nama_barang, $harga, $supplier, $tanggal_pembelian);

    if ($stmt->execute()) {
        header("Location: purchasing.php");
        exit();
    } else {
        echo "Gagal menambah data!";
    }
}
?>
<head>
    <meta charset="UTF-8">
    <title>Tambah Data Purchasing</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>


<div class="container">
    <h2 class="text-center">Tambah Data Purchasing</h2>
    <form method="POST">
        <label class="form-label">Nama Barang</label>
        <input type="text" name="nama_barang" required class="form-control mb-3">

        <label class="form-label">Harga</label>
        <input type="number" step="0.01" name="harga" required class="form-control mb-3">

        <label class="form-label">Supplier</label>
        <input type="text" name="supplier" class="form-control mb-3">

        <label class="form-label">Tanggal Pembelian</label>
        <input type="date" name="tanggal_pembelian" required class="form-control mb-3">

        <button type="submit" class="btn btn-success">Simpan</button>
        <a href="purchasing.php" class="btn btn-secondary">Kembali</a>
    </form>
</div>