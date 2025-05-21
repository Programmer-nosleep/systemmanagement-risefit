import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight, faUserCheck, faCalendarAlt, faInfoCircle, faTicketAlt } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";

const DashboardUser = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [showMembershipForm, setShowMembershipForm] = useState(false);
    const [showMembershipDetail, setShowMembershipDetail] = useState(false);
    const [loading, setLoading] = useState(true);
    
    const [membershipData, setMembershipData] = useState({
        paket: "",
        tanggal_mulai: "",
        tanggal_akhir: "",
    });

    const [transactions, setTransactions] = useState([]); // Define transactions state
    const [currentPage, setCurrentPage] = useState(1); // Define currentPage state
    const itemsPerPage = 5; // Default items per page

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/class.php`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await response.json();
                setDashboardData(data);
                setTransactions(data.kelas || []); // Assuming data.kelas contains the list of classes
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMembershipData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMembershipSubmit = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/register_membership.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(membershipData),
            });

            const result = await response.json();
            if (result.success) {
                alert("Membership berhasil didaftarkan!");
                setShowMembershipForm(false);
                window.location.reload(); // reload agar membership terbaru tampil
            } else {
                alert("Gagal: " + result.message);
            }
        } catch (err) {
            console.error("Error submitting membership:", err);
        }
    };

    const isMembershipActive = !!dashboardData?.membership;

    // Get the current page's transactions
    const currentTransactions = transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // Handle pagination
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    return (
        <div className="bg-gray-100 flex flex-col h-screen relative">
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
                        <h1 className="text-3xl font-bold text-gray-800 mb-1">Dashboard</h1>
                        <p className="text-gray-600">Selamat datang kembali! Kelola aktivitas Anda dengan mudah.</p>
                    </div>

                    <div className="max-w-7xl mx-auto grid grid-cols-1 mt-5">
                        <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2 border">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-semibold text-gray-800">Jadwal Kelas Tersedia</h3>
                                {!isMembershipActive ? (
                                    <button
                                        onClick={() => setShowMembershipForm(true)}
                                        className="bg-gradient-to-r from-green-400 to-green-600 text-white text-sm px-4 py-1.5 rounded shadow hover:opacity-90"
                                    >
                                        + Daftar Membership
                                    </button>
                                ) : (
                                    <div className="flex items-center space-x-2 bg-green-100 text-green-800 text-sm px-3 py-1.5 rounded shadow border border-green-300">
                                        <FontAwesomeIcon icon={faUserCheck} />
                                        <span className="font-medium">Membership Aktif</span>
                                        <button
                                            onClick={() => setShowMembershipDetail(!showMembershipDetail)}
                                            className="text-blue-600 hover:underline"
                                        >
                                            Detail
                                        </button>
                                    </div>
                                )}
                            </div>

                            {showMembershipDetail && dashboardData?.membership && (
                                <div className="mb-4 p-4 rounded bg-blue-50 text-sm text-blue-900 border border-blue-200">
                                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500" />
                                    <strong>Detail Membership</strong>
                                    <ul className="mt-2 ml-4 list-disc">
                                        <li><strong>Paket:</strong> {dashboardData.membership.paket}</li>
                                        <li><strong>Tanggal Mulai:</strong> {dashboardData.membership.tanggal_mulai}</li>
                                        <li><strong>Tanggal Akhir:</strong> {dashboardData.membership.tanggal_akhir}</li>
                                        <li><strong>Status:</strong> {dashboardData.membership.status}</li>
                                    </ul>
                                </div>
                            )}

                            {showMembershipForm && (
                                <div className="bg-white border border-gray-300 rounded-lg p-4 mb-4 shadow-sm">
                                    <h4 className="text-lg font-semibold mb-3">Formulir Pendaftaran Membership</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <input
                                            type="text"
                                            name="paket"
                                            placeholder="Nama Paket"
                                            value={membershipData.paket}
                                            onChange={handleInputChange}
                                            className="border px-3 py-2 rounded w-full"
                                        />
                                        <input
                                            type="date"
                                            name="tanggal_mulai"
                                            value={membershipData.tanggal_mulai}
                                            onChange={handleInputChange}
                                            className="border px-3 py-2 rounded w-full"
                                        />
                                        <input
                                            type="date"
                                            name="tanggal_akhir"
                                            value={membershipData.tanggal_akhir}
                                            onChange={handleInputChange}
                                            className="border px-3 py-2 rounded w-full"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            onClick={handleMembershipSubmit}
                                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            onClick={() => setShowMembershipForm(false)}
                                            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                <table className="w-full text-sm text-left text-gray-700">
                                    <thead className="text-xs text-gray-600 bg-gray-100 border-b">
                                        <tr>
                                            <th className="px-4 py-2">Nama Kelas</th>
                                            <th className="px-4 py-2">Jadwal</th>
                                            <th className="px-4 py-2">Slot Tersedia</th>
                                            <th className="px-4 py-2 text-center"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentTransactions.map((kelas) => (
                                            <tr key={kelas.id} className="border-b hover:bg-gray-50 transition">
                                                <td className="px-4 py-2">{kelas.nama_kelas}</td>
                                                <td className="px-4 py-2 flex items-center gap-2">
                                                    {kelas.jadwal}
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-400" />
                                                </td>
                                                <td className="px-4 py-2">{kelas.slot_tersedia}</td>
                                                <td className="px-4 py-2 text-center">
                                                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center gap-1 justify-center">
                                                        <FontAwesomeIcon icon={faTicketAlt} className="w-4 h-4" />
                                                        Booking
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex items-center justify-between my-3 rounded-lg p-3">
                                    <div className="flex-1 flex justify-between sm:hidden">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
                                        >
                                            &larr; Previous
                                        </button>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="ml-3 px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition duration-300"
                                        >
                                            Next &rarr;
                                        </button>
                                    </div>
                                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm text-gray-700">
                                                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                                                <span className="font-medium">{Math.min(currentPage * itemsPerPage, transactions.length)}</span>{" "}
                                                of <span className="font-medium">{transactions.length}</span> results
                                            </p>
                                        </div>
                                        <div>
                                            <nav className="inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-2 text-gray-400 bg-white border border-gray-300 rounded-l-lg hover:bg-indigo-50 transition duration-300"
                                                >
                                                    &lt;
                                                </button>
                                                {[...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i + 1}
                                                        onClick={() => handlePageChange(i + 1)}
                                                        className={`px-4 py-2 text-sm border border-gray-300 font-semibold transition duration-300 ${currentPage === i + 1 ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-white text-gray-900 hover:bg-gray-50"}`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))}
                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-2 font-semibold text-gray-400 bg-white border border-gray-300 rounded-r-lg hover:bg-indigo-50 transition duration-300"
                                                >
                                                    &gt;
                                                </button>
                                            </nav>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardUser;
