<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require_once __DIR__ . '/../config/db.php'; // koneksi $conn

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['user_id'])) {
        // Ambil data user dari database
        require_once __DIR__ . '/../config/db.php';
        
        $stmt = $conn->prepare("SELECT username FROM users WHERE id = ?");
        $stmt->bind_param("i", $_SESSION['user_id']);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($row = $result->fetch_assoc()) {
            echo json_encode([
                "success" => true,
                "username" => $row['username']
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "User tidak ditemukan"
            ]);
        }
        
        $stmt->close();
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Tidak ada sesi user aktif"
        ]);
    }
}

// Hanya tangani metode POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Ambil data JSON dari React
    $input = json_decode(file_get_contents("php://input"), true);
    $username = trim($input['username'] ?? '');
    $password = trim($input['password'] ?? '');
    $role     = trim($input['role'] ?? '');

    // Validasi awal
    if (empty($username) || empty($password) || empty($role)) {
        echo json_encode(["success" => false, "message" => "Lengkapi semua data"]);
        exit;
    }

    // Enkripsi password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Siapkan query insert
    $stmt = $conn->prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $hashedPassword, $role);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "User berhasil ditambahkan"]);
    } else {
        echo json_encode(["success" => false, "message" => "Gagal menambahkan user: " . $conn->error]);
    }

    $stmt->close();
    $conn->close();
    exit;
}

// Handle DELETE request
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Ambil ID user yang akan dihapus
    $id = $_GET['id'] ?? null;

    if (!$id) {
        echo json_encode([
            "success" => false,
            "message" => "ID user tidak ditemukan"
        ]);
        exit;
    }

    // Siapkan query delete
    $stmt = $conn->prepare("DELETE FROM users WHERE id = ? AND role != 'admin'");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            echo json_encode([
                "status" => "success",  // Ubah dari success menjadi status
                "message" => "User berhasil dihapus"
            ]);
        } else {
            echo json_encode([
                "status" => "error",
                "message" => "User tidak ditemukan atau tidak dapat dihapus"
            ]);
        }
    }

    $stmt->close();
    $conn->close();
    exit;
}

echo json_encode(["success" => false, "message" => "Hanya metode POST yang diizinkan"]);
