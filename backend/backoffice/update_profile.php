<?php
// Header untuk CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Tangani preflight OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

session_start();
$response = [];

if (!isset($_SESSION['user_id'])) {
    echo json_encode(["success" => false, "message" => "Belum login."]);
    exit;
}

require_once '../config/db.php'; // Pastikan file ini mengatur $conn (mysqli connection)

$userId = $_SESSION['user_id'];
$nama = $_POST['id_name'] ?? '';
$status = $_POST['status_message'] ?? '';
$nomorTelepon = $_POST['nomor_telepon'] ?? '';
$newPassword = $_POST['password'] ?? ''; // Fix: ubah dari 'password' ke 'newPassword'

if ($newPassword) {
    $newPassword = password_hash($newPassword, PASSWORD_DEFAULT);
}

// Jika gambar diunggah
if (isset($_FILES['photo']) && $_FILES['photo']['error'] === UPLOAD_ERR_OK) {
    // Tentukan folder tempat menyimpan gambar
    $targetDir = "../uploads/";

    // Pastikan folder tujuan ada
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0755, true);
    }

    // Ambil ekstensi file dan buat nama file unik
    $fileTmp = $_FILES['photo']['tmp_name'];
    $fileExt = pathinfo($_FILES['photo']['name'], PATHINFO_EXTENSION);
    $uniqueName = uniqid('profile_', true) . '.' . strtolower($fileExt);
    $targetFilePath = $targetDir . $uniqueName;

    // Validasi tipe file gambar (opsional, tapi disarankan)
    $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
    if (!in_array(strtolower($fileExt), $allowedTypes)) {
        echo json_encode(["success" => false, "message" => "Tipe file tidak didukung."]);
        exit;
    }

    // Pindahkan file gambar ke folder yang ditentukan
    if (move_uploaded_file($fileTmp, $targetFilePath)) {
        $imgPath = "/uploads/" . $uniqueName; // Simpan sebagai path relatif untuk digunakan di frontend
    } else {
        echo json_encode(["success" => false, "message" => "Gagal mengunggah gambar."]);
        exit;
    }

    // Validasi file benar-benar gambar
    if (!getimagesize($fileTmp)) {
        echo json_encode(["success" => false, "message" => "File bukan gambar valid."]);
        exit;
    }

} else {
    $imgPath = null;
}

try {
    if ($imgPath && $newPassword) {
        // Update dengan foto dan password baru
        $stmt = $conn->prepare("UPDATE users SET id_name = ?, status_message = ?, nomor_telepon = ?, img = ?, password = ? WHERE id = ?");
        $stmt->bind_param("sssssi", $nama, $status, $nomorTelepon, $imgPath, $newPassword, $userId);
    } elseif ($imgPath) {
        // Update dengan foto saja
        $stmt = $conn->prepare("UPDATE users SET id_name = ?, status_message = ?, nomor_telepon = ?, img = ? WHERE id = ?");
        $stmt->bind_param("ssssi", $nama, $status, $nomorTelepon, $imgPath, $userId);
    } elseif ($newPassword) {
        // Update dengan password baru saja
        $stmt = $conn->prepare("UPDATE users SET id_name = ?, status_message = ?, nomor_telepon = ?, password = ? WHERE id = ?");
        $stmt->bind_param("ssssi", $nama, $status, $nomorTelepon, $newPassword, $userId);
    } else {
        // Update tanpa foto dan password
        $stmt = $conn->prepare("UPDATE users SET id_name = ?, status_message = ?, nomor_telepon = ? WHERE id = ?");
        $stmt->bind_param("sssi", $nama, $status, $nomorTelepon, $userId);
    }

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "message" => "Gagal memperbarui data."]);
    }
} catch (mysqli_sql_exception $e) {
    echo json_encode(["success" => false, "message" => "DB Error: " . $e->getMessage()]);
}
?>
