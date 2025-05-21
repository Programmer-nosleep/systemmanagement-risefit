import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Navigation from "../../components/Navigation";

const Purcasing = () => {
  const [orders, setOrders] = useState([]);
  const [totalSemua, setTotalSemua] = useState(0);

  useEffect(() => {
    // Fetch data dari backend PHP
    fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/purchasing.php`)
      .then(response => response.json())
      .then(data => {
        setOrders(data.orders);
        setTotalSemua(data.total_semua);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

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
            <h1 className="text-2xl font-bold">Purchasing</h1>
            <p className="text-gray-700">Lorem ipsum dolor, sit amet consectetur adipisicing elit...</p>
          </div>
  
          <div className="max-w-7xl mx-auto mt-5">
            <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Daftar Pesanan</h3>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
                  <thead className="border-b bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">No</th>
                      <th className="px-4 py-2 text-center">Deskripsi</th>
                      <th className="px-4 py-2 text-center">Jumlah</th>
                      <th className="px-4 py-2 text-center">Tanggal</th>
                      <th className="px-4 py-2 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map((order, index) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50 text-sm font-montserrat">
                          <td className="px-4 py-2">{index + 1}</td>
                          <td className="px-4 py-2">{order.nama_barang}</td>
                          <td className="px-4 py-2 text-center">{order.jumlah}</td>
                          <td className="px-4 py-2 text-center">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="px-4 py-2 text-center">
                            <button className="text-blue-500 hover:text-blue-700">
                              <FontAwesomeIcon icon={faInfoCircle} className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-4 text-gray-400">Tidak ada data pesanan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
  
};

export default Purcasing;
