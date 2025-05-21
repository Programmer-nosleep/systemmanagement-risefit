<?php
require '../includes/config.php';
// Cek apakah user adalah backoffice
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'backoffice') {
    header("Location: ../login.php");
    exit();
}

$query = "SELECT p.id, u.nama AS nama_user, p.nama_barang, p.jumlah, p.total_harga, p.status, p.created_at 
          FROM pesanan p 
          JOIN users u ON p.user_id = u.id
          ORDER BY p.created_at DESC";
$result = $conn->query($query);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Daftar Pesanan</title>
    <link rel="stylesheet" href="./assets/css/style.css">
</head>
<style>
    body {
    font-family: Arial, sans-serif;
    margin: 20px;
    padding: 20px;
    background-color: #f4f4f4;
}

h2 {
    text-align: center;
    color: #333;
}

table {
    width: 100%;
    border-collapse: collapse;
    background: white;
}

th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

th {
    background-color: #007BFF;
    color: white;
}

tr:nth-child(even) {
    background-color: #f2f2f2;
}

select, button {
    padding: 5px;
    border-radius: 5px;
}

button {
    background-color: #28a745;
    color: white;
    border: none;
    cursor: pointer;
}
.button {

    color: black;
}

button:hover {
    background-color: #218838;
}

</style>
<body>

<h2>Daftar Pesanan</h2>

<table border="1">
    <thead>
        <tr>
            <th>ID Pesanan</th>
            <th>Nama User</th>
            <th>Barang</th>
            <th>Jumlah</th>
            <th>Total Harga</th>
            <th>Status</th>
            <th>Aksi</th>
        </tr>
    </thead>
    <tbody>
        <?php while ($row = $result->fetch_assoc()): ?>
        <tr>
            <td><?= $row['id'] ?></td>
            <td><?= htmlspecialchars($row['nama_user']) ?></td>
            <td><?= htmlspecialchars($row['nama_barang']) ?></td>
            <td><?= $row['jumlah'] ?></td>
            <td>Rp <?= number_format($row['total_harga'], 2, ',', '.') ?></td>
            <td><?= $row['status'] ?></td>
            <td>
                <form action="update_pesanan.php" method="POST">
                    <input type="hidden" name="id" value="<?= $row['id'] ?>">
                    <select name="status">
                        <option value="Menunggu" <?= $row['status'] == 'Menunggu' ? 'selected' : '' ?>>Menunggu</option>
                        <option value="Diproses" <?= $row['status'] == 'Diproses' ? 'selected' : '' ?>>Diproses</option>
                        <option value="Selesai" <?= $row['status'] == 'Selesai' ? 'selected' : '' ?>>Selesai</option>
                    </select>
                    <button type="submit">Update</button>
                   
                </form>
                
            </td>
        </tr>
        <?php endwhile; ?>
        
    </tbody>
    
</table>
<a href="dashboard.php" class="button">Kembali Ke Dashboard</a> 
</body>
</html>
