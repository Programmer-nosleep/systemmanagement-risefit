import React, { useState, useEffect } from "react"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import { faHome, faChevronRight, faChevronDown, faChevronUp, faUserShield, faMoneyBillWave, faExchangeAlt, faTrash, faPlusCircle, faSearch, faTimes, faExclamationTriangle, faPen, faSave } from "@fortawesome/free-solid-svg-icons"; 
import { Line } from "react-chartjs-2"; 
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend } from "chart.js"; 

import PopupProvider from "../../components/Popup"; 
import Navbar from "../../components/Navbar";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const AdminPanel = () => {
    // State untuk informasi user yang sedang login
    const [userName, setUserName] = useState("Loading...");

    // State untuk data statistik dashboard
    const [totalAdmin, setTotalAdmin] = useState(0);
    const [totalFinance, setTotalFinance] = useState(0);
    const [totalPurchasing, setTotalPurchasing] = useState(0);

    // State untuk manajemen data pengguna
    const [dataUserAdmin, setDataUserAdmin] = useState([]);
    const [dataUser, setDataUser] = useState([]);
    const [dataBackoffice, setDataBackoffice] = useState([]); // Ganti dari dataapi
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [selectedDeleteUser, setSelectedDeleteUser] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    
    // State untuk form pengguna baru
    const [newUser, setNewUser] = useState({
        username: "",  // Ubah dari nama menjadi username
        role: "",
        tanggal_daftar: "",
    });

    // State untuk UI control
    const [openSection, setOpenSection] = useState("admin");
    const [currentPage, setCurrentPage] = useState(1);
    const [searchAdmin, setSearchAdmin] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [searchStaff, setSearchStaff] = useState("");
    const [showPopup, setShowPopup] = useState({
        add: false,
        delete: false,
    });

    const itemsPerPage = 10;

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin_panel.php`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                setUserName(data.username || "Admin");
                console.log("Username loaded:", data.username);
            } else {
                console.error("Failed to get user data:", data.message);
                setUserName("Admin");
            }
        })
        .catch(error => {
            console.error("Error fetching user info:", error);
            setUserName("Admin");
        });
    }, []);

    // Data untuk chart
    const chartData = {
        labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
        datasets: [
            {
                label: "Admin",
                data: dataUserAdmin?.map(user => user.total) || [],
                borderColor: "rgba(54, 162, 235, 1)",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Transaksi",
                data: dataUser?.map(user => user.total) || [],
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
                tension: 0.4,
            },
            {
                label: "Pembelian",
                data: dataBackoffice?.map(user => user.total) || [],
                borderColor: "rgba(255, 159, 64, 1)",
                backgroundColor: "rgba(255, 159, 64, 0.2)",
                fill: true,
                tension: 0.4,
            }
        ]
    };

    // Opsi untuk chart
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Statistik Pengguna',
                font: {
                    size: 16
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                }
            },
            x: {
                grid: {
                    display: false
                }
            }
        }
    };

    // Utility functions
    const capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const togglePopup = (popupName) => {
        setShowPopup((prevValue) => {
            const newValue = {};
            for (const [key, value] of Object.entries(prevValue)) {
                newValue[key] = key === popupName ? !value : false;
            }
            return newValue;
        });
    };

    const toggleSection = (section) => {
        setOpenSection(section);
    };

    // Search handlers
    const handleSearchAdmin = (e) => setSearchAdmin(e.target.value);
    const handleSearchUser = (e) => setSearchUser(e.target.value);
    const handleSearchStaff = (e) => setSearchStaff(e.target.value);

    // User management handlers
    const handleAddUser = () => togglePopup('add');
    const handleChange = (e) => setNewUser({ ...newUser, [e.target.name]: e.target.value });

    // Handle submit user baru
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin_panel.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams(newUser),
        })
            .then((response) => response.json())
            .then(({ status, data, message }) => {
                if (status === "success") {
                    setUsers(data);
                } else {
                    console.error(message);
                }
                togglePopup("add");
                setNewUser({ username: "", role: "", tanggal_daftar: "" });  // Ubah dari nama menjadi username
            });
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin_panel.php`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                id: editingUser.id,
                ...newUser
            }),
        })
            .then((response) => response.json())
            .then(({ status, data }) => {
                if (status === "success") {
                    setUsers(data);
                    setEditingUser(null);
                }
                togglePopup("add");
            });
    };

    // Handle konfirmasi hapus user
    const confirmDelete = (id) => {
        togglePopup("delete");
        setSelectedDeleteUser(id);
    };

        // Handle hapus user
        const handleDelete = (id) => {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin_panel.php`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ id: id })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
                    setDataUserAdmin(prev => prev.filter(user => user.id !== id));
                    setDataUser(prev => prev.filter(user => user.id !== id));
                    setDataBackoffice(prev => prev.filter(user => user.id !== id));
                    togglePopup("delete");
                } else {
                    console.error("Failed to delete user:", data.message);
                }
            })
            .catch(error => {
                console.error("Error:", error);
            });
        };

        // Fetch data users
        useEffect(() => {
            fetch(`${process.env.REACT_APP_BACKEND_URL}/api/admin_panel.php`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.json())
                .then((data) => setUsers(data))
                .catch((error) => console.error('Error fetching users:', error));
        }, []);

    // Fetch data statistik
    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/statistics.php`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setTotalAdmin(data.total_admin);
                setTotalFinance(data.total_finance);
                setTotalPurchasing(data.total_purchasing);
                setDataUserAdmin(data.admin_users);
                setDataUser(data.regular_users);
                setDataBackoffice(data.backoffice_users); // Ganti dari api_users
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, []);

    // Filter data berdasarkan pencarian dengan null checking
    const filteredDataAdmin = dataUserAdmin?.filter(user =>
        user?.username?.toLowerCase().includes(searchAdmin.toLowerCase())
    ) || [];

    const filteredDataUser = dataUser?.filter(user =>
        user?.username?.toLowerCase().includes(searchUser.toLowerCase())
    ) || [];

    const filteredDataStaff = dataBackoffice?.filter(user =>
        user?.username?.toLowerCase().includes(searchStaff.toLowerCase()) ||
        user?.nama?.toLowerCase().includes(searchStaff.toLowerCase())
    ) || [];

    const renderUserList = (data, type) => (
        <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center">
                <div className="relative w-1/2 max-w-xs">
                    <FontAwesomeIcon
                        icon={faSearch}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs"
                    />
                    <input
                        type="text"
                        placeholder="Cari pengguna..."
                        value={
                            type === "admin" ? searchAdmin :
                            type === "user" ? searchUser :
                            searchStaff
                        }
                        onChange={
                            type === "admin" ? handleSearchAdmin :
                            type === "user" ? handleSearchUser :
                            handleSearchStaff
                        }
                        className="pl-8 pr-2 py-1 w-full border border-gray-300 bg-white rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <button
                    onClick={handleAddUser}
                    className="flex items-center space-x-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                >
                    <FontAwesomeIcon icon={faPlusCircle} />
                    <span>Tambah Pengguna</span>
                </button>
            </div>
    
            <table className="w-full table-auto border-collapse text-sm mt-2">
                <thead>
                    <tr className="border-b bg-gray-100">
                        <th className="p-2 text-left">No</th>
                        <th className="p-2 text-left">Username</th>
                        <th className="p-2 text-left">Role</th>
                        <th className="p-2 text-left"></th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((user, index) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{user.username}</td>
                            <td className="p-2">{capitalizeFirstLetter(user.role)}</td>
                            <td className="p-2 text-center">
                                {user.role !== "admin" && (
                                    <button
                                        onClick={() => confirmDelete(user.id)}
                                        className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                        title="Hapus Pengguna"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <Navbar
                navLinks={[
                    { name: "Overview", path: "/admin" },
                    { name: "Dashboard Backoffice", path: "/dashboard" },
                    { name: "Dasboard Utama", path: "/dashboard-user" },
                    { name: "Riwayat", path: "/riwayat" },
                ]}
            />
    
            <header className="bg-white shadow border-b">
                <div className="max-w-7xl mx-auto py-6 px-4">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Selamat Datang, <span className="text-blue-600">{capitalizeFirstLetter(userName)}</span>
                    </h1>
                </div>
            </header>
    
            <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Breadcrumb */}
                    <nav className="flex items-center text-sm text-gray-600 space-x-2 mb-4">
                        <FontAwesomeIcon icon={faHome} className="w-4 h-4 text-gray-500" />
                        <FontAwesomeIcon icon={faChevronRight} className="w-3 h-3 text-gray-400" />
                        <span className="font-semibold text-gray-800">Overview</span>
                    </nav>
    
                    {/* Statistik Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200 transition-colors duration-300 hover:bg-blue-500 hover:border-blue-600 group">
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
    
                        <div className="bg-green-50 p-6 rounded-lg border border-green-200 transition-colors duration-300 hover:bg-green-500 hover:border-green-600 group">
                            <div className="flex items-center space-x-4">
                                <div className="text-green-600 text-3xl group-hover:text-white">
                                    <FontAwesomeIcon icon={faMoneyBillWave} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-green-800 group-hover:text-white">Total Transaksi</h4>
                                    <p className="text-2xl font-bold text-green-600 group-hover:text-white">{totalFinance}</p>
                                </div>
                            </div>
                        </div>
    
                        <div className="bg-orange-50 p-6 rounded-lg border border-orange-200 transition-colors duration-300 hover:bg-orange-500 hover:border-orange-600 group">
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
    
                    {/* Chart dan Daftar Pengguna */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md border">
                            <h4 className="text-xl font-bold mb-4">Statistik Pengguna</h4>
                            <Line data={chartData} options={chartOptions} />
                        </div>
    
                        <div className="space-y-6">
                            {[
                                { type: "admin", label: "Pengguna Admin", data: filteredDataAdmin },
                                { type: "user", label: "Pengguna User", data: filteredDataUser },
                                { type: "staff", label: "Pengguna Staff", data: filteredDataStaff },
                            ].map(({ type, label, data }) => (
                                <div key={type} className="bg-white p-4 rounded-lg shadow-md border">
                                    <div
                                        className="flex justify-between items-center cursor-pointer"
                                        onClick={() => toggleSection(type)}
                                    >
                                        <h4 className="text-lg font-bold">{label}</h4>
                                        <FontAwesomeIcon icon={openSection === type ? faChevronUp : faChevronDown} />
                                    </div>
                                    {openSection === type && renderUserList(data, type)}
                                </div>
                            ))}
                        </div>

                        {/* Popup tambah pengguna */}
                        <PopupProvider open={showPopup.add}>
                            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto">
                                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                    <FontAwesomeIcon icon={editingUser ? faPen : faSave} />
                                    {editingUser ? "Edit Pengguna" : "Tambah Pengguna"}
                                </h2>
                                <form onSubmit={editingUser ? handleUpdate : handleSubmit} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            name="username" 
                                            value={editingUser ? editingUser.username : newUser.username}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <select
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            name="role"
                                            value={editingUser ? editingUser.role : newUser.role}
                                            onChange={handleChange}
                                        >
                                            <option value="">Pilih Role</option>
                                            <option value="user">User</option>
                                            <option value="api">Backoffice</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Daftar</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                            name="tanggal_daftar"
                                            value={editingUser ? editingUser.tanggal_daftar : newUser.tanggal_daftar}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="submit"
                                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow transition"
                                        >
                                            <FontAwesomeIcon icon={faSave} />
                                            {editingUser ? "Update" : "Simpan"}
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

                        {/* popup hapus pengguna */}
                        <PopupProvider open={showPopup.delete}>
                            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md mx-auto">
                                <div className="flex flex-col items-center text-center mb-6">
                                    <FontAwesomeIcon
                                        icon={faExclamationTriangle}
                                        className="text-yellow-500 text-5xl mb-4"
                                    />
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Hapus Pengguna?
                                    </h2>
                                    <p className="text-gray-600 mt-2">
                                        Apakah Anda yakin ingin menghapus pengguna ini?
                                        Tindakan ini tidak dapat dibatalkan.
                                    </p>
                                </div>
                                <div className="flex justify-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(selectedDeleteUser)}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-lg shadow transition"
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                        Hapus
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            togglePopup("delete");
                                            setSelectedDeleteUser(null);
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
};

export default AdminPanel;
