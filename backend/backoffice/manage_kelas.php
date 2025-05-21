<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

require_once '../config/db.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nama_kelas = $_POST['nama_kelas'];
    $jenis_kelas = $_POST['jenis_kelas'];
    $jadwal = $_POST['jadwal'];
    $slot_tersedia = $_POST['slot_tersedia'];

    $stmt = $conn->prepare("INSERT INTO kelas (nama_kelas, jenis_kelas, jadwal, slot_tersedia) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("sssi", $nama_kelas, $jenis_kelas, $jadwal, $slot_tersedia);

    if ($stmt->execute()) {
        $result = $conn->query("SELECT * FROM kelas ORDER BY id DESC");
        $classes = [];
        while ($row = $result->fetch_assoc()) {
            $classes[] = $row;
        }

        echo json_encode([
            "status" => "success",
            "message" => "Data berhasil ditambahkan.",
            "data" => $classes
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menambahkan data."
        ]);
    }

    $stmt->close();
}

// Ambil data kelas (GET)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $result = $conn->query("SELECT * FROM kelas ORDER BY jadwal ASC");

    if ($result) {
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }

        echo json_encode($data ?: []);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Gagal mengambil data kelas']);
    }
    exit();
}

// Update kelas (PUT)
if ($_SERVER["REQUEST_METHOD"] === "PUT") {
    parse_str(file_get_contents("php://input"), $_PUT);
    $id = intval($_PUT['id']);
    $nama_kelas = $_PUT['nama_kelas'];
    $jenis_kelas = $_PUT['jenis_kelas'];
    $jadwal = $_PUT['jadwal'];
    $slot_tersedia = $_PUT['slot_tersedia'];

    $updateQuery = "UPDATE kelas SET nama_kelas=?, jenis_kelas=?, jadwal=?, slot_tersedia=? WHERE id=?";
    if ($stmt = mysqli_prepare($conn, $updateQuery)) {
        mysqli_stmt_bind_param($stmt, "sssii", $nama_kelas, $jenis_kelas, $jadwal, $slot_tersedia, $id);

        if (mysqli_stmt_execute($stmt)) {
            $query = "SELECT * FROM kelas ORDER BY jadwal ASC";
            $result = mysqli_query($conn, $query);

            $class = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $class[] = $row;
            }

            echo json_encode(['status' => 'success', 'data' => $class]);
        } else {
            echo json_encode(['status' => 'error', 'message' => mysqli_stmt_error($stmt)]);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }

    mysqli_stmt_close($stmt);
    exit();
}

// Hapus kelas (DELETE)
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    parse_str(file_get_contents("php://input"), $_DELETE); // Membaca data dari body
    
    if (isset($_DELETE['id'])) {
        $id = $_DELETE['id'];
        $stmt = $conn->prepare("DELETE FROM kelas WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Gagal menghapus kelas']);
        }
    } else {
        echo json_encode(['error' => 'ID tidak ditemukan']);
    }
    exit();
}
?>
