<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, PUT, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

require_once '../config/db.php';

if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Tangani preflight request
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}


// Menghandle permintaan POST untuk menambah transaksi
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $deskripsi = $_POST['deskripsi'];
    $jumlah = $_POST['jumlah'];
    $tanggal = $_POST['tanggal'];

    $insert_query = "INSERT INTO finance_transactions (deskripsi, jumlah, tanggal) VALUES ('$deskripsi', '$jumlah', '$tanggal')";

    if (mysqli_query($conn, $insert_query)) {
        $transactions_query = "SELECT * FROM finance_transactions ORDER BY tanggal DESC";
        $result = mysqli_query($conn, $transactions_query);

        $transactions = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $transactions[] = $row;
        }
        echo json_encode(['status' => 'success', 'data' => $transactions]);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
    exit();
}

// Menghandle permintaan GET untuk menampilkan transaksi
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $query = "SELECT * FROM finance_transactions ORDER BY tanggal DESC";
    $result = mysqli_query($conn, $query);

    $transactions = [];
    while ($row = mysqli_fetch_assoc($result)) {
        $transactions[] = $row;
    }

    echo json_encode($transactions);
    exit();
}

// Menghandle permintaan DELETE untuk menghapus transaksi berdasarkan ID
if ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    parse_str(file_get_contents("php://input"), $_DELETE); // Membaca data dari body
    if (isset($_DELETE['id'])) {
        $id = $_DELETE['id'];
        $query = "DELETE FROM finance_transactions WHERE id=$id";
        if (mysqli_query($conn, $query)) {
            echo json_encode(['status' => 'success']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to delete']);
        }
    }
    exit();
}

// Menghandle permintaan PUT untuk update transaksi berdasarkan ID
if ($_SERVER["REQUEST_METHOD"] == "PUT") {
    parse_str(file_get_contents("php://input"), $_PUT); // Reading data from body
    $id = intval($_PUT['id']);
    $deskripsi = $_PUT['deskripsi'];
    $jumlah = $_PUT['jumlah'];
    $tanggal = $_PUT['tanggal'];

    // Prepare the UPDATE query
    $updateQuery = "UPDATE finance_transactions 
                    SET deskripsi = ?, jumlah = ?, tanggal = ? 
                    WHERE id = ?";

    if ($stmt = mysqli_prepare($conn, $updateQuery)) {
        // Bind the parameters
        mysqli_stmt_bind_param($stmt, "sssi", $deskripsi, $jumlah, $tanggal, $id);

        // Execute the query
        if (mysqli_stmt_execute($stmt)) {
            // Query to fetch updated transactions
            $transactions_query = "SELECT * FROM finance_transactions ORDER BY tanggal DESC";
            $result = mysqli_query($conn, $transactions_query);

            $transactions = [];
            while ($row = mysqli_fetch_assoc($result)) {
                $transactions[] = $row;
            }
            echo json_encode(['status' => 'success', 'data' => $transactions]);
        } else {
            echo json_encode(['status' => 'error', 'message' => mysqli_stmt_error($stmt)]);
        }

        // Close the statement
        mysqli_stmt_close($stmt);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
}

?>
