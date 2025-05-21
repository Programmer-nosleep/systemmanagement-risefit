import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import Navigation from "../../components/Navigation";

const Acounting = () => {

    return (
        <div className="bg-gray-100 flex flex-col h-screen relative overflow-hidden">
            <Navigation />
            <main className="bg-gray-100 flex-1 p-6">
                <div className="mx-auto max-w-7xl"> 
                    <nav className="text-gray-600 text-sm mb-4">
                        <ul className="flex items-center space-x-2">
                            <FontAwesomeIcon icon={faHome} className="w-4 h-4 text-gray-500" />
                            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
                            <li>
                                <Link to="/dashboard-user" className="hover:underline">Overview</Link>
                            </li>
                            <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
                            <li className="text-gray-800 font-semibold">
                                Accounting
                            </li>
                        </ul>
                    </nav>
        
                    <div>
                        <h1 className="text-2xl font-bold">Accounting</h1>
                        <p className="text-gray-700">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptates reprehenderit, repellendus soluta repudiandae nisi architecto quisquam deserunt id ut qui accusantium adipisci veniam pariatur! Iusto maiores quidem suscipit reprehenderit ullam.</p>
                    </div>

                    <div className="max-w-7xl mx-auto mt-5">
                        <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2 border">
                        <div className="grid grid-cols-3 gap-4">

                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold">Daftar Table</h3>
                            {/* <button className="bg-blue-500 text-sm text-white px-3 py-1 rounded ml-2 hover:bg-blue-600">
                                Buat Transaksi
                            </button> */}
                        </div>
                        <div className="overflow-x-auto border border-gray-200 rounded-lg">
                            <table className="w-full  border-collapse">
                                <thead className="border-b border-gray-300 bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left">No</th>
                                        <th className="px-4 py-2 text-center">Deskripsi</th>
                                        <th className="px-4 py-2 text-center">Jumlah</th>
                                        <th className="px-4 py-2 text-center">Tanggal</th>
                                        <th className="px-4 py-2 text-center"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td colSpan="5" className="text-center py-4 text-gray-400">Tidak ada data tersedia.</td>
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

export default Acounting;