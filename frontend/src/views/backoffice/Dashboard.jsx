import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight, faUserShield, faMoneyBillWave, faExchangeAlt, faUser } from "@fortawesome/free-solid-svg-icons";

import Navigation from "../../components/Navigation";
import { Line, Pie } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ArcElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend, ArcElement);

export default function Dashboard() {
    const [totalAdmin, setTotalAdmin] = useState(0);
    const [totalFinance, setTotalFinance] = useState(0);
    const [totalPurchasing, setTotalPurchasing] = useState(0);

    const chartData = {
        labels: ["Admin", "Transaksi Keuangan", "Pembelian"],
        datasets: [
            {
                label: "Data Statistik",
                data: [totalAdmin, totalFinance, totalPurchasing],
                backgroundColor: ["#007bff", "#28a745", "#ffc107"],
                borderColor: "#007bff",
                fill: false,
                tension: 0.4,
            },
        ],
    };

    // Data untuk pie chart
    const pieChartData = {
        labels: ['Admin', 'Keuangan', 'Pembelian'],
        datasets: [{
            data: [totalAdmin, totalFinance, totalPurchasing],
            backgroundColor: [
                'rgba(54, 162, 235, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(255, 206, 86, 0.8)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(255, 206, 86, 1)'
            ],
            borderWidth: 1
        }]
    };

    // Opsi untuk pie chart
    const pieChartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom',
            },
            title: {
                display: true,
                text: 'Distribusi Data',
                font: {
                    size: 16
                }
            }
        }
    };

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
                    <Link to="/dashboard" className="font-bold">Dashboard</Link>
                  </li>
                  <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
                </ul>
              </nav>
      
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-gray-700">Dashboard memberikan akses cepat ke data yang paling relevan dan indikator kinerja untuk membantu Anda mengelola tugas dan operasi dengan efisien.</p>
              </div>
      
              {/* Card Statistics - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 transition-colors duration-300 hover:bg-blue-500 hover:border-blue-600 group">
                  <div className="flex items-center space-x-4">
                    <div className="text-blue-600 text-3xl group-hover:text-white">
                      <FontAwesomeIcon icon={faUserShield} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-blue-800 group-hover:text-white">Total Admin</h4>
                      <p className="text-2xl font-bold text-blue-600 group-hover:text-white">{totalAdmin}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border border-green-200 transition-colors duration-300 hover:bg-green-500 hover:border-green-600 group">
                  <div className="flex items-center space-x-4">
                    <div className="text-green-600 text-3xl group-hover:text-white">
                      <FontAwesomeIcon icon={faMoneyBillWave} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green-800 group-hover:text-white">Total Pemasukan</h4>
                      <p className="text-2xl font-bold text-green-600 group-hover:text-white">{totalFinance}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200 transition-colors duration-300 hover:bg-orange-500 hover:border-orange-600 group">
                  <div className="flex items-center space-x-4">
                    <div className="text-orange-600 text-3xl group-hover:text-white">
                      <FontAwesomeIcon icon={faExchangeAlt} />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-orange-800 group-hover:text-white">Total Pembelian</h4>
                      <p className="text-2xl font-bold text-orange-600 group-hover:text-white">{totalPurchasing}</p>
                    </div>
                  </div>
                </div>
              </div>
      
              {/* Charts Section - Responsive */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border">
                    <h3 className="text-xl font-bold mb-4">Statistik Distribusi</h3>
                    <div className="w-full h-64 sm:h-72">
                        <Pie data={pieChartData} options={{
                            ...pieChartOptions,
                            maintainAspectRatio: false,
                            responsive: true,
                            plugins: {
                                ...pieChartOptions.plugins,
                                legend: {
                                    ...pieChartOptions.plugins.legend,
                                    position: window.innerWidth < 768 ? 'bottom' : 'right'
                                }
                            }
                        }} />
                    </div>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md border">
                    <h3 className="text-xl font-bold mb-4">Laporan Keuangan</h3>
                    <div className="overflow-x-auto -mx-4 sm:mx-0">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Keterangan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pemasukan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Pengeluaran
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            01/01/2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            Pembayaran Member
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                            Rp 1.500.000
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                            -
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            02/01/2024
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            Pembelian Alat
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                                            -
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                                            Rp 500.000
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot className="bg-gray-50">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900" colSpan="2">
                                            Total
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                            Rp 1.500.000
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                            Rp 500.000
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      );                
}
