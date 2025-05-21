<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once __DIR__ . '/../config/db.php'; // koneksi $conn

// Pastikan session berjalan
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Ambil user_id dari session
$user_id = $_SESSION['user_id'];

// Jika menerima request dari scanner QR
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Pastikan data QR dan lokasi dikirim
    if (!isset($_POST['qr_data']) || !isset($_POST['latitude']) || !isset($_POST['longitude'])) {
        echo json_encode(["status" => "error", "message" => "Data tidak lengkap!"]);
        exit();
    }

    $kode_absensi = $_POST['qr_data'];
    $latitude = $_POST['latitude'];
    $longitude = $_POST['longitude'];

    // Koordinat lokasi gym (sesuaikan dengan lokasi gym asli)
    $gym_lat = -6.2088;  // Contoh: Jakarta
    $gym_lng = 106.8456;

    // Fungsi untuk menghitung jarak antara user dan lokasi gym
    function hitungJarak($lat1, $lon1, $lat2, $lon2) {
        $earth_radius = 6371; // Radius bumi dalam km
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) * sin($dLat / 2) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $earth_radius * $c;
    }

    // Hitung jarak antara user dengan lokasi gym
    $jarak = hitungJarak($latitude, $longitude, $gym_lat, $gym_lng);

    if ($jarak > 0.2) { // Maksimal 200 meter dari gym
        echo json_encode(["status" => "error", "message" => "Anda harus berada di lokasi gym untuk scan QRIS!"]);
        exit();
    }

    // Cek apakah kode absensi valid dan masih aktif
    $query = "SELECT id FROM absensi_qr WHERE kode_absensi = ? AND status = 'aktif'";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $kode_absensi);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(["status" => "error", "message" => "QR Code tidak valid atau sudah digunakan!"]);
        exit();
    }

    // Simpan absensi ke database
    $query = "INSERT INTO absensi (user_id, kode_absensi, waktu_absensi, lokasi) VALUES (?, ?, NOW(), ?)";
    $stmt = $conn->prepare($query);
    $lokasi = "Lat: $latitude, Lng: $longitude";
    $stmt->bind_param("iss", $user_id, $kode_absensi, $lokasi);

    if ($stmt->execute()) {
        // Update status QR Code menjadi 'digunakan'
        $query = "UPDATE absensi_qr SET status = 'digunakan' WHERE kode_absensi = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("s", $kode_absensi);
        $stmt->execute();

        echo json_encode(["status" => "success", "message" => "Absensi berhasil!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan absensi."]);
    }

    exit();
}