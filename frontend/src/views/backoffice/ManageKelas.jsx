import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight, faPlusCircle, faEdit, faTrash, faTimes, faSave, faExclamationTriangle, faPen } from "@fortawesome/free-solid-svg-icons";

import Navigation from '../../components/Navigation';
import PopupProvider from "../../components/Popup";

export default function ManageKelas() {
  const [selectedKelasId, setSelectedKelasId] = useState(null);
  const [kelasList, setKelasList] = useState([]);
  const [selectedDeleteKelas, setSelectedDeleteKelas] = useState(null);
  const [form, setForm] = useState({
    nama_kelas: '',
    jenis_kelas: 'Umum',
    jadwal: '',
    slot_tersedia: '',
  });
  const [showPopup, setShowPopup] = useState({ add: false, edit: false, delete: false });

  // Fungsi untuk memuat data kelas
  const fetchKelas = () => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/manage_kelas.php`)
      .then((response) => response.json())
      .then((data) => setKelasList(data))
      .catch((error) => console.error('Error fetching data:', error));
  };

  // Memuat data kelas saat komponen dimuat
  useEffect(() => {
    fetchKelas();
  }, []);

  // Mengatur visibilitas popup
  const togglePopup = (popupName) => {
    setShowPopup((prevValue) => {
      const newValue = {};
      for (const [key, value] of Object.entries(prevValue)) {
        newValue[key] = key === popupName ? !value : false;
      }
      return newValue;
    });
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/manage_kelas.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(form),
    })
      .then((response) => response.json())
      .then(({ status, message }) => {
        if (status === 'success') {
          fetchKelas(); // Memuat ulang data kelas
        } else {
          console.error(message);
        }
        togglePopup('add');
        setForm({
          nama_kelas: '',
          jenis_kelas: 'Umum',
          jadwal: '',
          slot_tersedia: '',
        });
      })
      .catch((error) => console.error('Error submitting form:', error));
  };

  // Menangani konfirmasi penghapusan kelas
  const confirmDelete = (id) => {
    togglePopup('delete');
    setSelectedDeleteKelas(id);
  };

  // Menangani penghapusan kelas
  const handleDelete = (id) => {
    // Tambahkan console.log untuk debugging
    console.log("Menghapus kelas dengan ID:", id);
    
    fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/manage_kelas.php`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ id: id }).toString(),
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Response data:", data);
        if (data.success) {
            fetchKelas(); // Refresh data
            togglePopup('delete');
        } else {
            console.error('Error:', data.error);
            alert('Gagal menghapus kelas: ' + data.error);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menghapus kelas');
        togglePopup('delete');
    });
};

  // Menangani perubahan input pada form edit
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  // Menangani inisialisasi form edit
  const handleEdit = (kelas) => {
      setSelectedKelasId(kelas.id); // Mengoper seluruh objek kelas
      setForm({
          nama_kelas: kelas.nama_kelas,
          jenis_kelas: kelas.jenis_kelas,
          jadwal: kelas.jadwal,
          slot_tersedia: kelas.slot_tersedia,
      });
      togglePopup('edit');
  };

  // Menangani submit form untuk memperbarui kelas
  const submitUpdate = async (e) => {
    e.preventDefault();
    if (!selectedKelasId) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/manage_kelas.php`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          id: selectedKelasId,
          ...form,
        }),
      });
      if (!res.ok) throw res;
      const { status, message } = await res.json();
      if (status === 'success') {
        fetchKelas(); // Memuat ulang data kelas
      } else {
        console.error(message);
      }
    } catch (error) {
      console.error('Error updating kelas:', error);
    }
    togglePopup('edit');
  }

  return (
    <div className="bg-gray-100 flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <nav className="text-gray-600 text-sm mb-6">
            <ul className="flex items-center space-x-2">
              <FontAwesomeIcon icon={faHome} className="w-4 h-4 text-gray-500" />
              <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
              <li>
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              </li>
              <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
              <li className="text-gray-800 font-semibold">Manage Class</li>
            </ul>
          </nav>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Management Class</h1>
            <p className="text-gray-600">
              Tambahkan dan kelola kelas yang tersedia di sistem Anda. Anda bisa memasukkan informasi dasar seperti nama kelas, jenis, jadwal, dan slot peserta.
            </p>
          </div>

          {/* Grid Whiteboxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Form Whitebox */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <h3 className="text-xl font-bold mb-5">Tambah Kelas</h3>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                  <input
                    type="text"
                    name="nama_kelas"
                    required
                    value={form.nama_kelas}
                    onChange={handleInput}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelas</label>
                  <select
                    name="jenis_kelas"
                    required
                    value={form.jenis_kelas}
                    onChange={handleInput}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Umum">Umum</option>
                    <option value="Khusus">Khusus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal</label>
                  <input
                    type="datetime-local"
                    name="jadwal"
                    required
                    value={form.jadwal}
                    onChange={handleInput}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Slot Tersedia</label>
                  <input
                    type="number"
                    name="slot_tersedia"
                    required
                    value={form.slot_tersedia}
                    onChange={handleInput}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                  >
                    <FontAwesomeIcon icon={faPlusCircle} className="w-4 h-4" />
                    Tambah Kelas
                  </button>
                </div>
              </form>
            </div>

            {/* Tabel Whitebox */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-200">
              <h3 className="text-xl font-bold mb-5">Daftar Kelas</h3>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm text-gray-700 table-auto">
                  <thead className="bg-gray-100 text-gray-700 font-semibold">
                    <tr>
                      <th className="px-4 py-2 border-b text-left">Nama</th>
                      <th className="px-4 py-2 border-b text-left">Jenis</th>
                      <th className="px-4 py-2 border-b text-left">Jadwal</th>
                      <th className="px-4 py-2 border-b text-left">Slot</th>
                      <th className="px-4 py-2 border-b text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kelasList.map((k, i) => (
                      <tr key={k.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="px-4 py-2 border-b">{k.nama_kelas}</td>
                        <td className="px-4 py-2 border-b">{k.jenis_kelas}</td>
                        <td className="px-4 py-2 border-b">{new Date(k.jadwal).toLocaleString('id-ID')}</td>
                        <td className="px-4 py-2 border-b">{k.slot_tersedia}</td>
                        <td className="px-4 py-2 border-b space-x-3">
                          <button onClick={() => handleEdit(k.id)} className="text-yellow-600 hover:text-yellow-800">
                            <FontAwesomeIcon icon={faEdit} className="w-5 h-5" />
                          </button>
                          <button onClick={() => confirmDelete(k.id)} className="text-red-600 hover:text-red-800">
                            <FontAwesomeIcon icon={faTrash} className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {kelasList.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                          Belum ada kelas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popup Edit Kelas */}
            <PopupProvider open={showPopup.edit}>
              <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                  <FontAwesomeIcon icon={faPen} />
                  Edit Kelas
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Kelas</label>
                    <input
                      type="text"
                      name="nama_kelas"
                      value={form.nama_kelas}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Kelas</label>
                    <select
                      name="jenis_kelas"
                      value={form.jenis_kelas}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    >
                      <option value="Umum">Umum</option>
                      <option value="Khusus">Khusus</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Jadwal</label>
                    <input
                      type="text"
                      name="jadwal"
                      value={form.jadwal}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slot Tersedia</label>
                    <input
                      type="number"
                      name="slot_tersedia"
                      value={form.slot_tersedia}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition"
                    >
                      <FontAwesomeIcon icon={faSave} />
                      Perbarui
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePopup('edit')}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-5 py-2.5 rounded-lg shadow transition"
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      Tutup
                    </button>
                  </div>
                </form>
              </div>
            </PopupProvider>

            {/* Popup Delete Kelas */}
            <PopupProvider open={showPopup.delete}>
              <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto">
                <div className="flex flex-col items-center text-center mb-6">
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    className="text-yellow-500 text-5xl mb-4"
                  />
                  <h2 className="text-2xl font-bold text-gray-800">
                    Hapus Kelas?
                  </h2>
                  <p className="text-gray-600 mt-2">
                    Apakah Anda yakin ingin menghapus kelas ini?
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
                <div className="flex justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(selectedDeleteKelas)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg shadow transition"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    Hapus
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      togglePopup("delete");
                      setSelectedDeleteKelas(null);
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
        </div>
      </main>
    </div>
  );
}
