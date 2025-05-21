<?php
require '../includes/config.php';

// Debug session
if (!isset($_SESSION['user_id']) || !isset($_SESSION['role'])) {
    die("Session tidak ditemukan, harap login kembali.");
}

// Debug role
if (!in_array($_SESSION['role'], ['admin', 'backoffice'])) {
    die("Akses ditolak. Role Anda: " . $_SESSION['role']);
}

// Cek ID valid
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    die("ID tidak valid!");
}

$id = (int) $_GET['id']; 

// Ambil data berdasarkan ID
$query = "SELECT * FROM purchasing WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_assoc();

// Cek apakah data ditemukan
if (!$data) {
    die("Data tidak ditemukan!");
}

// Jika form disubmit
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama_barang = $_POST['nama_barang'];
    $harga = (float) $_POST['harga'];
    $supplier = $_POST['supplier'];
    $tanggal_pembelian = $_POST['tanggal_pembelian'];

    // Update data
    $stmt = $conn->prepare("UPDATE purchasing SET nama_barang=?, harga=?, supplier=?, tanggal_pembelian=? WHERE id=?");
    $stmt->bind_param("sdisi", $nama_barang, $harga, $supplier, $tanggal_pembelian, $id);

    if ($stmt->execute()) {
        header("Location: purchasing.php");
        exit();
    } else {
        echo "Gagal mengupdate data!";
    }
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Edit Data Purchasing</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="../assets/css/style.css">
</head>
<body>
<div class="container">
    <h2 class="text-center">Edit Data Purchasing</h2>
    <form method="POST">
        <label class="form-label">Nama Barang</label>
        <input type="text" name="nama_barang" value="<?= htmlspecialchars($data['nama_barang']) ?>" required class="form-control mb-3">

        <label class="form-label">Harga</label>
        <input type="number" step="0.01" name="harga" value="<?= htmlspecialchars($data['harga']) ?>" required class="form-control mb-3">

        <label class="form-label">Supplier</label>
        <input type="text" name="supplier" value="<?= htmlspecialchars($data['supplier']) ?>" required class="form-control mb-3">

        <label class="form-label">Tanggal Pembelian</label>
        <input type="date" name="tanggal_pembelian" value="<?= htmlspecialchars($data['tanggal_pembelian']) ?>" required class="form-control mb-3">

        <button type="submit" class="btn btn-warning">Update</button>
        <a href="purchasing.php" class="btn btn-secondary">Kembali</a>
    </form>
</div>
</body>
</html>