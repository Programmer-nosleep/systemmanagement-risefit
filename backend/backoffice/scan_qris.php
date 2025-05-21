<?php
require '../includes/config.php';

?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Scan QRIS - Absensi</title>
    <script src="https://unpkg.com/html5-qrcode@2.2.1/html5-qrcode.min.js" defer></script>
</head>
<body>
    <h2>Scan QRIS untuk Absensi</h2>
    <div id="reader"></div>
    <p id="status"></p>

    <script>
        function startScanner() {
            let scanner = new Html5Qrcode("reader");

            scanner.start(
                { facingMode: "environment" },
                { fps: 10, qrbox: 250 },
                (decodedText) => {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            let latitude = position.coords.latitude;
                            let longitude = position.coords.longitude;

                            fetch("scan_qris.php", {
                                method: "POST",
                                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                                body: `qr_data=${decodedText}&latitude=${latitude}&longitude=${longitude}`
                            })
                            .then(response => response.json())
                            .then(data => {
                                document.getElementById("status").innerText = data.message;
                                if (data.status === "success") {
                                    alert("Absensi berhasil!");
                                    window.location.href = "#";
                                }
                            });
                        },
                        function(error) {
                            document.getElementById("status").innerText = "Gagal mendapatkan lokasi!";
                        }
                    );
                }
            );
        }

        startScanner();
    </script>
</body>
</html>
