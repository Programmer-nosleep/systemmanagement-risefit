import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import Navigation from "../../components/Navigation";

const Marketing = () => {
    const [showMembershipModal, setShowMembershipModal] = useState(false);
    const [showPTModal, setShowPTModal] = useState(false);
    const [sales, setSales] = useState([]);
    
    return (
        <div className="bg-gray-100 flex flex-col h-screen relative">

            <Navigation />
            {/* Main Content */}
            <main className="bg-gray-100 flex-1 p-6">
                <div className="mx-auto max-w-7xl"> 
                    <nav className="text-gray-600 text-sm mb-4">
                        <ul className="flex items-center space-x-2">
                            <FontAwesomeIcon icon={faHome} className="w-4 h-4 text-gray-500" />
                            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
                            <li>
                                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                            </li>
                            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
                            <li className="text-gray-800 font-semibold">
                                Acounting
                            </li>
                        </ul>
                    </nav>
        
                    <div>
                        <h1 className="text-2xl font-bold">Marketing Sales</h1>
                        <p className="text-gray-700">Kelola penjualan membership dan paket personal trainer, termasuk pembuatan invoice dan pemantauan status pembayaran secara real-time.</p>
                    </div>
                    {/* Ringkasan & Statistik */}
                    <div className="max-w-7xl mx-auto mt-5">
                        <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2 border">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            {/* Card Statistik */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h4 className="text-sm font-semibold text-blue-800">Total Penjualan</h4>
                                <p className="text-2xl font-bold text-blue-600">Rp 0</p>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h4 className="text-sm font-semibold text-green-800">Membership Aktif</h4>
                                <p className="text-2xl font-bold text-green-600">0</p>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                <h4 className="text-sm font-semibold text-orange-800">PT Session Aktif</h4>
                                <p className="text-2xl font-bold text-orange-600">0</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Daftar Penjualan</h3>
                            <div className="flex gap-2">
                                <button 
                                    className="bg-blue-500 text-sm text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                    onClick={() => setShowMembershipModal(true)}
                                >
                                    Tambah Membership
                                </button>
                                <button 
                                    className="bg-green-500 text-sm text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                                    onClick={() => setShowPTModal(true)}
                                >
                                    Tambah PT Package
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full border-collapse">
                                <thead className="border-b border-gray-300 bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">No Invoice</th>
                                        <th className="px-4 py-2 text-left">Tanggal</th>
                                        <th className="px-4 py-2 text-left">Member</th>
                                        <th className="px-4 py-2 text-left">Jenis</th>
                                        <th className="px-4 py-2 text-right">Total</th>
                                        <th className="px-4 py-2 text-center">Status</th>
                                        <th className="px-4 py-2 text-center">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-400">Tidak ada data pesanan.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Marketing;