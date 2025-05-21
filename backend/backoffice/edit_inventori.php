<?php
require '../includes/config.php';

// Pastikan hanya admin yang bisa mengakses
if (!isset($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
    die("Akses ditolak!");
}

// Cek apakah ada ID inventori yang dikirim
if (!isset($_GET['id'])) {
    die("ID Inventori tidak ditemukan!");
}

$id = intval($_GET['id']);

// Ambil data inventori berdasarkan ID
$query = "SELECT * FROM inventori WHERE id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
$barang = $result->fetch_assoc();

if (!$barang) {
    die("Data inventori tidak ditemukan!");
}

// Jika form disubmit, lakukan update
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nama_barang = $_POST['nama_barang'];
    $kategori = $_POST['kategori'];
    $stok = intval($_POST['stok']);
    $harga = floatval($_POST['harga']);
    $supplier = $_POST['supplier'];

    $query = "UPDATE inventori SET nama_barang=?, kategori=?, stok=?, harga=?, supplier=? WHERE id=?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("ssidsi", $nama_barang, $kategori, $stok, $harga, $supplier, $id);

    if ($stmt->execute()) {
        echo "<script>alert('Inventori berhasil diperbarui!'); window.location.href='inventori.php';</script>";
    } else {
        echo "<script>alert('Gagal memperbarui inventori!');</script>";
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Edit Inventori</title>
    <link rel="stylesheet" href="./assets/css/style.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }

        .container {
            width: 40%;
            margin: 50px auto;
            background: white;
            padding: 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }

        h2 {
            text-align: center;
            color: #333;
        }

        label {
            display: block;
            font-weight: bold;
            margin: 10px 0 5px;
        }

        input[type="text"], input[type="number"] {
            width: 97%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
        }

        button {
            width: 100%;
            background: #28a745;
            color: white;
            padding: 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        button:hover {
            background: #218838;
        }

        .cancel-btn {
            display: block;
            text-align: center;
            margin-top: 10px;
            padding: 10px;
            background: #dc3545;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }

        .cancel-btn:hover {
            background: #c82333;
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Edit Inventori</h2>
    <form method="post">
        <label>Nama Barang:</label>
        <input type="text" name="nama_barang" value="<?= htmlspecialchars($barang['nama_barang']) ?>" required>

        <label>Kategori:</label>
        <input type="text" name="kategori" value="<?= htmlspecialchars($barang['kategori']) ?>" required>

        <label>Stok:</label>
        <input type="number" name="stok" value="<?= $barang['stok'] ?>" required>

        <label>Harga (Rp):</label>
        <input type="number" name="harga" step="0.01" value="<?= $barang['harga'] ?>" required>

        <label>Supplier:</label>
        <input type="text" name="supplier" value="<?= htmlspecialchars($barang['supplier']) ?>" required>

        <button type="submit">Simpan Perubahan</button>
        <a href="inventori.php" class="cancel-btn">Batal</a>
    </form>
</div>

</body>
</html>
