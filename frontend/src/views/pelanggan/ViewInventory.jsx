import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";

const ViewInventory = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/daftar_barang.php`)
            .then((response) => response.json())
            .then((data) => {
                setInventory(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching inventory:", error);
                setLoading(false);
            });
    }, []);

    const handlePayment = async (item) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/transaksi.php`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nama_barang: item.nama_barang,
                    harga: item.harga,
                    metode: 'midtrans'
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (data.status === 'success') {
                window.snap.pay(data.snap_token, {
                    onSuccess: function(result) {
                        alert('Pembayaran berhasil!');
                        // Refresh halaman atau update state
                    },
                    onPending: function(result) {
                        alert('Menunggu pembayaran Anda');
                    },
                    onError: function(result) {
                        alert('Pembayaran gagal!');
                    },
                    onClose: function() {
                        alert('Anda menutup popup pembayaran tanpa menyelesaikan pembayaran');
                    }
                });
            } else {
                alert('Gagal memproses pembayaran');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Terjadi kesalahan saat memproses pembayaran');
        }
    };

    return (
        <div className="bg-gray-100 flex flex-col h-screen relative overflow-hidden">
            <Navbar
                navLinks={[
                    { name: "Overview", path: "/dashboard-user" },
                    { name: "Lihat Barang", path: "/lihat-barang" },
                    { name: "Booking Kelas", path: "/booking-kelas" },
                    { name: "Riwayat", path: "/riwayat" },
                ]}
            />
            <main className="bg-gray-100 flex-1 p-6">
                <div className="mx-auto max-w-7xl">
                    <nav className="text-gray-600 text-sm mb-4">
                        <ul className="flex items-center space-x-2">
                            <FontAwesomeIcon icon={faHome} className="w-4 h-4 text-gray-500" />
                            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
                            <li>
                                <Link to="/dashboard-user" className="hover:underline">Overview</Link>
                            </li>
                        </ul>
                    </nav>
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-1">Peralatan Gym</h1>
                        <p className="text-gray-600">Selamat datang kembali! Kelola aktivitas Anda dengan mudah.</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-md mt-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Daftar Peralatan Gym</h2>

                        {loading ? (
                            <p>Loading inventory...</p>
                        ) : (
                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full text-sm text-left text-gray-700">
                                    <thead className="text-xs text-gray-600 bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-4 py-2">Nama Barang</th>
                                            <th className="px-4 py-2">Kategori</th>
                                            <th className="px-4 py-2">Stok</th>
                                            <th className="px-4 py-2">Harga</th>
                                            <th className="px-4 py-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {inventory.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                    Tidak ada data barang tersedia.
                                                </td>
                                            </tr>
                                        ) : (
                                            inventory.map((item, index) => (
                                                <tr key={index} className="border-b hover:bg-gray-50 transition">
                                                    <td className="px-5 py-2">{item.nama_barang}</td>
                                                    <td className="px-5 py-2">{item.kategori}</td>
                                                    <td className="px-5 py-2">{item.stok}</td>
                                                    <td className="px-5 py-2">
                                                        Rp {parseInt(item.harga).toLocaleString("id-ID")}
                                                    </td>
                                                    <td className="py-4">
                                                        <button 
                                                            onClick={() => handlePayment(item)}
                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center gap-2 transition"
                                                        >
                                                            <FontAwesomeIcon icon={faShoppingCart} />
                                                            Pesan
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ViewInventory;
