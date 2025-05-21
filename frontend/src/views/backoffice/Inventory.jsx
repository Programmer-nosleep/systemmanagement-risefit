import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight, faPen, faTrash, faSave, faTimes, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

import Navigation from "../../components/Navigation";
import PopupProvider from "../../components/Popup";

const Inventory = () => {
  const [selectedTransactionId, setSelectedTransactionId] = useState();
  const [transactions, setTransactions] = useState([]);
  const [newTransaction, setNewTransaction] = useState({
    namaBarang: "",
    kategori: "",
    stok: "",
    harga: "",
    supplier: "",
  });
  const [selectedDeleteTransaction, setSelectedDeleteTransaction] =
    useState(null);
  const [editingTransaction, setEditingTransaction] = useState({
    id: "",
    namaBarang: "",
    kategori: "",
    stok: "",
    harga: "",
    supplier: "",
  });
  const [showPopup, setShowPopup] = useState({
    add: false,
    delete: false,
    edit: false,
  });

  const [kategoriOptions, setKategoriOptions] = useState([]);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/inventori.php?kategori=true`)
      .then(res => res.json())
      .then(data => setKategoriOptions(data));
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const togglePopup = (popupName) =>
    setShowPopup((prevValue) => {
      const newValue = {};
      for (const [key, value] of Object.entries(prevValue)) {
        newValue[key] = key === popupName ? !value : false;
      }
      return newValue;
    });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/inventori.php`)
      .then((response) => response.json())
      .then((data) => setTransactions(data));
  }, []);

  // Handle New Transaction Input onChange
  const handleNewTransactionChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  // Handle Edit Transaction Input onChange
  const handleEditTransactionChange = (e) => {
    setEditingTransaction({
      ...editingTransaction,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Change
  const handleChange = (e) => {
    setNewTransaction({ ...newTransaction, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/inventori.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(newTransaction),
    })
      .then((response) => response.json())
      .then(({ status, data, message }) => {
        if (status === "success") {
          setTransactions(data);
        } else {
          console.error(message);
        }
        togglePopup("add");
        setNewTransaction({ namaBarang: "", kategori: "", stok: "", harga: "", supplier: "" });
      });
  };

  // Handle form submission for updating transaction
  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editingTransaction.id) return;

    fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/inventori.php`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(editingTransaction),
    })
      .then((response) => response.json())
      .then(({ status, data }) => {
        if (status === "success") {
          setTransactions(data);
        } else {
          console.error("Error updating transaction");
        }
        togglePopup("edit");
      });
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    togglePopup("edit");
  };

  const confirmDelete = (id) => {
    togglePopup("delete");
    setSelectedDeleteTransaction(id);
  };

  const handleDelete = (id) => {
    fetch(
      `${process.env.REACT_APP_BACKEND_URL}/backoffice/inventori.php?id=${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ id: id }),
        credentials: 'include'
      }
    )
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(({ status }) => {
        if (status === "success") {
            setTransactions(
                transactions.filter((transaction) => transaction.id !== id)
            );
            alert('Data berhasil dihapus');
        } else {
            console.error("Error deleting transaction");
            alert('Gagal menghapus data');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menghapus data');
    })
    .finally(() => {
        togglePopup("delete");
    });
};

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
      <Navigation />
      <main className="bg-gray-100 flex-1 p-6">
        <div className="mx-auto max-w-7xl">
          <nav className="text-gray-600 text-sm mb-4">
            <ul className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faHome} className="w-4 h-4 text-gray-500" />
              <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
              <li>
                <Link to="/dashboard" className="hover:underline">
                  Dashboard
                </Link>
              </li>
              <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
              <li className="text-gray-800 font-semibold">Accounting</li>
            </ul>
          </nav>

          <div>
            <h1 className="text-2xl font-bold">Inventory</h1>
            <p className="text-gray-700">Kelola dan pantau stok barang, kategori, harga, dan supplier. Halaman ini memungkinkan Anda untuk menambah, mengubah, dan menghapus data inventaris secara efisien.</p>
          </div>

          <div className="max-w-7xl mx-auto mt-5">
            <div className="bg-white p-6 rounded-2xl shadow-md md:col-span-2 border">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Table Barang</h3>
                <button
                  onClick={() => togglePopup("add")}
                  className="bg-green-600 text-sm text-white px-3 py-1 rounded ml-2 hover:bg-green-700"
                >
                  Tambah Barang
                </button>
              </div>
              <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="w-full border-collapse rounded-lg overflow-hidden shadow">
                  <thead className="border-b bg-gray-100 text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left">No</th>
                      <th className="px-4 py-2 text-center">Nama Barang</th>
                      <th className="px-4 py-2 text-center">Kategori</th>
                      <th className="px-4 py-2 text-center">Stok</th>
                      <th className="px-4 py-2 text-center">Harga</th>
                      <th className="px-4 py-2 text-center">Supplier</th>
                      <th className="px-4 py-2 text-center"></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white text-gray-700">
                    {transactions.map((transaction, index) => (
                      <tr key={transaction.id} className="border-b hover:bg-gray-50 text-sm font-montserrat">
                        <td className="px-4 py-2">{index + 1}</td>
                        <td className="px-4 py-2 text-center">{transaction.nama_barang}</td>
                        <td className="px-4 py-2 text-center">{transaction.kategori}</td>
                        <td className="px-4 py-2 text-center">{transaction.stok}</td>
                        <td className="px-4 py-2 text-center">Rp. {Number(transaction.harga).toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td className="px-4 py-2 text-center">{transaction.supplier}</td>
                        <td className="px-4 py-2 text-center">
                          <div className="flex items-center justify-center gap-3">
                            <button
                              onClick={() => handleEdit(transaction)}
                              title="Edit"
                              className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 px-3 py-1 rounded-lg transition shadow-sm"
                            >
                              <FontAwesomeIcon icon={faPen} />
                            </button>
                            <button
                              onClick={() => confirmDelete(transaction.id)}
                              title="Hapus"
                              className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-lg transition shadow-sm"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* popup tambah transaksi */}
                <PopupProvider open={showPopup.add}>
                  <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <FontAwesomeIcon icon={faSave} />
                      Tambah Barang
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                        <input
                          type="text"
                          name="namaBarang"
                          // value={editingTransaction ? editingTransaction.nama_barang : newTransaction.namaBarang}
                          value={newTransaction.namaBarang}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select
                          name="kategori"
                          // value={editingTransaction ? editingTransaction.kategori : newTransaction.kategori}
                          value={newTransaction.kategori}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                          <option value="">Pilih Kategori</option>
                          {kategoriOptions.map((kategori, i) => (
                            <option key={i} value={kategori}>{kategori}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                        <input
                          type="number"
                          name="stok"
                          // value={editingTransaction ? editingTransaction.stok : newTransaction.stok}
                          value={newTransaction.stok}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                        <input
                          type="number"
                          name="harga"
                          // value={editingTransaction ? editingTransaction.harga : newTransaction.harga}
                          value={newTransaction.harga}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                        <input
                          type="text"
                          name="supplier"
                          // value={editingTransaction ? editingTransaction.supplier : newTransaction.supplier}
                          value={newTransaction.supplier}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          type="submit"
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition"
                        >
                          <FontAwesomeIcon icon={faSave} />
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePopup("add")}
                          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2.5 rounded-lg shadow transition"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                          Tutup
                        </button>
                      </div>
                    </form>
                  </div>
                </PopupProvider>

                {/* popup edit transaksi */}
                <PopupProvider open={showPopup.edit}>
                  <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                      <FontAwesomeIcon icon={faPen} />
                      Edit Transaksi
                    </h2>
                    <form
                      onSubmit={handleUpdate}
                      className="space-y-5"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nama Barang</label>
                        <input
                          type="text"
                          name="namaBarang"
                          // value={editingTransaction ? editingTransaction.nama_barang : newTransaction.namaBarang}
                          value={editingTransaction.nama_barang}
                          onChange={handleEditTransactionChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                        <select
                          name="kategori"
                          // value={editingTransaction ? editingTransaction.kategori : newTransaction.kategori}
                          value={editingTransaction.kategori}
                          onChange={handleEditTransactionChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        >
                          <option value="">Pilih Kategori</option>
                          {kategoriOptions.map((kategori, i) => (
                            <option key={i} value={kategori}>{kategori}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                        <input
                          type="number"
                          name="stok"
                          // value={editingTransaction ? editingTransaction.stok : newTransaction.stok}
                          value={editingTransaction.stok}
                          onChange={handleEditTransactionChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Harga</label>
                        <input
                          type="number"
                          name="harga"
                          // value={editingTransaction ? editingTransaction.harga : newTransaction.harga}
                          value={editingTransaction.harga}
                          onChange={handleEditTransactionChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                        <input
                          type="text"
                          name="supplier"
                          // value={editingTransaction ? editingTransaction.supplier : newTransaction.supplier}
                          value={editingTransaction.supplier}
                          onChange={handleEditTransactionChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>
                      <div className="flex justify-end gap-3 pt-4">
                        <button
                          type="submit"
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition"
                        >
                          <FontAwesomeIcon icon={faSave} />
                          Simpan
                        </button>
                        <button
                          type="button"
                          onClick={() => togglePopup("edit")}
                          className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2.5 rounded-lg shadow transition"
                        >
                          <FontAwesomeIcon icon={faTimes} />
                          Tutup
                        </button>
                      </div>
                    </form>
                  </div>
                </PopupProvider>

                {/* popup hapus transaksi */}
                <PopupProvider open={showPopup.delete}>
                  <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto">
                    <div className="flex flex-col items-center text-center mb-6">
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-yellow-500 text-5xl mb-4"
                      />
                      <h2 className="text-2xl font-bold text-gray-800">
                        Hapus Transaksi?
                      </h2>
                      <p className="text-gray-600 mt-2">
                        Apakah Anda yakin ingin menghapus transaksi ini?
                        Tindakan ini tidak dapat dibatalkan.
                      </p>
                    </div>
                    <div className="flex justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(selectedDeleteTransaction)}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg shadow transition"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                        Hapus
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          togglePopup("delete");
                          setSelectedDeleteTransaction(null);
                        }}
                        className="flex items-center gap-2 bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2.5 rounded-lg shadow transition"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                        Batalkan
                      </button>
                    </div>
                  </div>
                </PopupProvider>
              </div>
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
                      Showing{" "}
                      <span className="font-medium">
                        {(currentPage - 1) * itemsPerPage + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(
                          currentPage * itemsPerPage,
                          transactions.length
                        )}
                      </span>{" "}
                      of{" "}
                      <span className="font-medium">{transactions.length}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="inline-flex -space-x-px rounded-md shadow-sm"
                      aria-label="Pagination"
                    >
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
                          className={`px-4 py-2 text-sm border border-gray-300 font-semibold transition duration-300 ${
                            currentPage === i + 1
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "bg-white text-gray-900 hover:bg-gray-50"
                          }`}
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
      </main>
    </div>
  );
};

export default Inventory;
