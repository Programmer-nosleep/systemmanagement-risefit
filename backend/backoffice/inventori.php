<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require_once __DIR__ . '/../config/db.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Endpoint untuk mendapatkan data kategori (enum)
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['kategori'])) {
    $query = "SHOW COLUMNS FROM inventori WHERE Field = 'kategori'";
    $result = $conn->query($query);
    $row = $result->fetch_assoc();
    
    // Ekstrak enum dari database
    preg_match('/^enum\((.*)\)$/', $row['Type'], $matches);
    $enumStr = $matches[1];
    $kategoriOptions = array_map(function($val) {
        return trim($val, "'");
    }, explode(',', $enumStr));

    echo json_encode($kategoriOptions);
}

if ($_SERVER["REQUEST_METHOD"] == "GET" && !isset($_GET['kategori'])) {
    $query = "SELECT * FROM inventori ORDER BY id DESC";
    $result = $conn->query($query);

    $inventories = [];
    while ($row = $result->fetch_assoc()) {
        $inventories[] = $row;
    }

    echo json_encode($inventories);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $namaBarang = $_POST["namaBarang"] ?? '';
    $kategori = $_POST["kategori"] ?? '';
    $stok = $_POST["stok"] ?? 0;
    $harga = $_POST["harga"] ?? 0;
    $supplier = $_POST["supplier"] ?? '';

    $stmt = $conn->prepare("INSERT INTO inventori (nama_barang, kategori, stok, harga, supplier) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdds", $namaBarang, $kategori, $stok, $harga, $supplier);

    if ($stmt->execute()) {
        $result = $conn->query("SELECT * FROM inventori ORDER BY id DESC");
        $inventories = [];
        while ($row = $result->fetch_assoc()) {
            $inventories[] = $row;
        }

        echo json_encode([
            "status" => "success",
            "message" => "Data berhasil ditambahkan.",
            "data" => $inventories
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menambahkan data."
        ]);
    }

    $stmt->close();
}

// PUT: Update data
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    parse_str(file_get_contents("php://input"), $_PUT);
    $id = intval($_PUT["id"]);
    $nama_barang = $_PUT["nama_barang"];
    $jumlah = $_PUT["jumlah"];
    $kategori = $_PUT["kategori"];
    $lokasi = $_PUT["lokasi"];

    $stmt = $conn->prepare("UPDATE inventori SET nama_barang=?, jumlah=?, kategori=?, lokasi=? WHERE id=?");
    $stmt->bind_param("sissi", $nama_barang, $jumlah, $kategori, $lokasi, $id);
    if ($stmt->execute()) {
        $result = $conn->query("SELECT * FROM inventori ORDER BY id DESC");
        $inventories = [];
        while ($row = $result->fetch_assoc()) {
            $inventories[] = $row;
        }

        echo json_encode([
            "status" => "success",
            "message" => "Data berhasil diperbarui.",
            "data" => $inventories
        ]);
    }
}

// DELETE: Hapus data
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    parse_str(file_get_contents("php://input"), $_DELETE);
    $id = intval($_DELETE['id']);
    $query = "DELETE FROM inventori WHERE id=$id";

    if (mysqli_query($conn, $query)) {
        $result = $conn->query("SELECT * FROM inventori ORDER BY id DESC");
        $inventories = [];
        while ($row = $result->fetch_assoc()) {
            $inventories[] = $row;
        }

        echo json_encode([
            'status' => 'success',
            'message' => 'Data berhasil dihapus.',
            'data' => $inventories
        ]);
    }
}

?>
