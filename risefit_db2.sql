-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 11, 2025 at 08:09 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `risefit_db2`
--

-- --------------------------------------------------------

--
-- Table structure for table `absensi`
--

CREATE TABLE `absensi` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `kode_absensi` varchar(50) NOT NULL,
  `waktu_absensi` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `absensi`
--

INSERT INTO `absensi` (`id`, `user_id`, `kode_absensi`, `waktu_absensi`) VALUES
(1, 2, '17394746555904', '2025-02-13 19:26:08');

-- --------------------------------------------------------

--
-- Table structure for table `absensi_karyawan`
--

CREATE TABLE `absensi_karyawan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `tanggal` date NOT NULL,
  `jam_masuk` time DEFAULT NULL,
  `jam_keluar` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `absensi_qr`
--

CREATE TABLE `absensi_qr` (
  `id` int(11) NOT NULL,
  `kode_absensi` varchar(50) NOT NULL,
  `status` enum('aktif','digunakan') NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `absensi_qr`
--

INSERT INTO `absensi_qr` (`id`, `kode_absensi`, `status`, `created_at`) VALUES
(1, '17394744846522', 'aktif', '2025-02-13 19:21:25'),
(2, '17394746422341', 'aktif', '2025-02-13 19:24:02'),
(3, '17394746555904', 'digunakan', '2025-02-13 19:24:15');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `checkin_time` datetime DEFAULT NULL,
  `checkout_time` datetime DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `status` enum('Checked In','Checked Out') DEFAULT 'Checked In'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `booking_kelas`
--

CREATE TABLE `booking_kelas` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `kelas_id` int(11) NOT NULL,
  `tanggal_booking` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `booking_kelas`
--

INSERT INTO `booking_kelas` (`id`, `member_id`, `kelas_id`, `tanggal_booking`) VALUES
(1, 5, 2, '2025-02-13 18:38:58'),
(2, 5, 3, '2025-02-19 17:53:41'),
(3, 5, 2, '2025-05-05 16:02:28'),
(4, 5, 4, '2025-05-08 08:11:54'),
(5, 5, 2, '2025-05-08 08:12:01');

-- --------------------------------------------------------

--
-- Table structure for table `finance_transactions`
--

CREATE TABLE `finance_transactions` (
  `id` int(11) NOT NULL,
  `deskripsi` varchar(255) NOT NULL,
  `jumlah` decimal(10,2) NOT NULL,
  `tanggal` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `finance_transactions`
--

INSERT INTO `finance_transactions` (`id`, `deskripsi`, `jumlah`, `tanggal`) VALUES
(2, '123213', 12321.00, '2025-01-05'),
(3, 'data2', 10005.00, '2025-05-07'),
(7, 'test 2', 123456.00, '2025-05-07'),
(10, 'data 3', 1234.00, '2025-05-07');

-- --------------------------------------------------------

--
-- Table structure for table `inventori`
--

CREATE TABLE `inventori` (
  `id` int(11) NOT NULL,
  `nama_barang` varchar(100) NOT NULL,
  `kategori` enum('Alat Fitness','Merchandise','Lainnya') NOT NULL,
  `stok` int(11) NOT NULL,
  `harga` decimal(10,2) NOT NULL,
  `supplier` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventori`
--

INSERT INTO `inventori` (`id`, `nama_barang`, `kategori`, `stok`, `harga`, `supplier`, `created_at`) VALUES
(1, 'Sarung Tangan Gym', 'Alat Fitness', 8, 50000.00, 'admin', '2025-02-12 18:49:23'),
(3, 'Barbel 50kg', 'Alat Fitness', 1000, 1000000.00, 'atmint', '2025-05-07 17:36:35'),
(4, 'Hand Grip', 'Merchandise', 1000, 10000000.00, 'atmint', '2025-05-07 17:44:38');

-- --------------------------------------------------------

--
-- Table structure for table `kelas`
--

CREATE TABLE `kelas` (
  `id` int(11) NOT NULL,
  `nama_kelas` varchar(100) NOT NULL,
  `jenis_kelas` varchar(50) NOT NULL,
  `jadwal` datetime NOT NULL,
  `slot_tersedia` int(11) NOT NULL DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kelas`
--

INSERT INTO `kelas` (`id`, `nama_kelas`, `jenis_kelas`, `jadwal`, `slot_tersedia`) VALUES
(2, 'Yoga', 'Umum', '2025-02-14 01:38:00', 100),
(3, 'Body Building ', 'Umum', '2025-03-07 00:53:00', 4),
(4, 'Angkat Barbel', 'Umum', '2025-05-07 23:53:00', 4),
(5, 'Drible', 'Umum', '2025-05-08 15:23:00', 100);

-- --------------------------------------------------------

--
-- Table structure for table `members`
--

CREATE TABLE `members` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `nomor_telepon` varchar(15) NOT NULL,
  `tanggal_daftar` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `members`
--

INSERT INTO `members` (`id`, `user_id`, `nama`, `email`, `password`, `created_at`, `nomor_telepon`, `tanggal_daftar`) VALUES
(5, 4, 'uwi', 'dev@gmail.com', '$2y$10$6mWX4iJ..Pxji4sR1/EggOkDU3M1zq8Bf9b8o7.PpgF69evu5FctS', '2025-02-12 21:22:11', '123123123213', '2025-02-13 04:22:11');

-- --------------------------------------------------------

--
-- Table structure for table `membership`
--

CREATE TABLE `membership` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_akhir` date NOT NULL,
  `status` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `paket` enum('1 Bulan','3 Bulan','6 Bulan','1 Tahun','15 Bulan') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `membership`
--

INSERT INTO `membership` (`id`, `member_id`, `tanggal_mulai`, `tanggal_akhir`, `status`, `paket`) VALUES
(5, 5, '2025-02-12', '2025-08-12', 'Aktif', '6 Bulan');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `member_id` int(11) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('Cash','Transfer','QRIS','Credit Card') NOT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('Pending','Completed','Failed') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pesanan`
--

CREATE TABLE `pesanan` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `nama_barang` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `total_harga` decimal(10,2) NOT NULL,
  `status` enum('Menunggu','Diproses','Selesai') DEFAULT 'Menunggu',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pesanan`
--

INSERT INTO `pesanan` (`id`, `user_id`, `nama_barang`, `jumlah`, `total_harga`, `status`, `created_at`) VALUES
(1, 4, 'Sarung Tangan Gym', 1, 50000.00, 'Selesai', '2025-02-17 20:53:22'),
(2, 4, 'Sarung Tangan Gym', 1, 50000.00, 'Selesai', '2025-02-19 17:51:50');

-- --------------------------------------------------------

--
-- Table structure for table `purchasing`
--

CREATE TABLE `purchasing` (
  `id` int(11) NOT NULL,
  `nama_barang` varchar(255) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `harga` decimal(15,2) NOT NULL,
  `supplier` varchar(255) DEFAULT NULL,
  `tanggal_pembelian` date NOT NULL,
  `status` enum('Pending','Diproses','Selesai') DEFAULT 'Pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `id_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `nomor_telepon` varchar(15) DEFAULT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','backoffice','user') NOT NULL DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `img` varchar(255) DEFAULT NULL,
  `status_message` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `id_name`, `email`, `nomor_telepon`, `username`, `password`, `role`, `created_at`, `img`, `status_message`) VALUES
(1, 'user1', 'john@example.com', '081234567890', 'user2', '123453', 'user', '2025-02-12 20:36:53', NULL, NULL),
(2, 'Admin', 'uzaifah27@gmail.com', '', 'dev', '$2y$10$jyE6RdYi/ri2nCkmQuKnb.h7kj.L4T0AvyuyCDJfsS3cZeUxdQjP6', 'admin', '2025-02-11 20:18:09', NULL, 'Admin'),
(3, 'backoff', 'backoff@gmail.com', NULL, 'backoff', '$2y$10$l34dZBu0iITgxUSWZY9WFufiBQwP9nA2MIc9FCUjJ5KZbl8e9nnz2', 'backoffice', '2025-02-11 20:22:16', NULL, NULL),
(4, 'User', 'user1@gmail.com', '', 'user1', '$2y$10$nZRyvhm4Sux4H3wULnL6wOvS4iulEOO0DIORPvfVVi9xCtxIpk0p6', 'user', '2025-02-11 22:57:14', NULL, 'Lorem ipsum dolor sit amet.'),
(6, 'Ahmad', 'zan123@gmail.com', '', 'zan123', '$2y$10$Cx7BVXHxRiOxn46Wvsa5vuKi42PJc2ncoERBXSgqqdMZjd//QKUDO', 'user', '2025-05-05 13:42:36', '', 'Lorem Ipsum'),
(8, 'napos', 'napos@gmail.com', NULL, 'napos213', '$2y$10$Bq1AuzeEEERLF9xZNXSDPeSSZqRBRiA8nho.UI4cKu7pl8NSWdtPS', 'user', '2025-05-05 15:06:57', NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absensi`
--
ALTER TABLE `absensi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `kode_absensi` (`kode_absensi`);

--
-- Indexes for table `absensi_karyawan`
--
ALTER TABLE `absensi_karyawan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `absensi_qr`
--
ALTER TABLE `absensi_qr`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_absensi` (`kode_absensi`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `booking_kelas`
--
ALTER TABLE `booking_kelas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`),
  ADD KEY `kelas_id` (`kelas_id`);

--
-- Indexes for table `finance_transactions`
--
ALTER TABLE `finance_transactions`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventori`
--
ALTER TABLE `inventori`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kelas`
--
ALTER TABLE `kelas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `members`
--
ALTER TABLE `members`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `membership`
--
ALTER TABLE `membership`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `member_id` (`member_id`);

--
-- Indexes for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `purchasing`
--
ALTER TABLE `purchasing`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absensi`
--
ALTER TABLE `absensi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `absensi_karyawan`
--
ALTER TABLE `absensi_karyawan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `absensi_qr`
--
ALTER TABLE `absensi_qr`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `booking_kelas`
--
ALTER TABLE `booking_kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `finance_transactions`
--
ALTER TABLE `finance_transactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `inventori`
--
ALTER TABLE `inventori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `kelas`
--
ALTER TABLE `kelas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `members`
--
ALTER TABLE `members`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `membership`
--
ALTER TABLE `membership`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pesanan`
--
ALTER TABLE `pesanan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `purchasing`
--
ALTER TABLE `purchasing`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absensi`
--
ALTER TABLE `absensi`
  ADD CONSTRAINT `absensi_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `absensi_ibfk_2` FOREIGN KEY (`kode_absensi`) REFERENCES `absensi_qr` (`kode_absensi`);

--
-- Constraints for table `absensi_karyawan`
--
ALTER TABLE `absensi_karyawan`
  ADD CONSTRAINT `absensi_karyawan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `booking_kelas`
--
ALTER TABLE `booking_kelas`
  ADD CONSTRAINT `booking_kelas_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `booking_kelas_ibfk_2` FOREIGN KEY (`kelas_id`) REFERENCES `kelas` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `members`
--
ALTER TABLE `members`
  ADD CONSTRAINT `members_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `membership`
--
ALTER TABLE `membership`
  ADD CONSTRAINT `membership_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `pesanan`
--
ALTER TABLE `pesanan`
  ADD CONSTRAINT `pesanan_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
