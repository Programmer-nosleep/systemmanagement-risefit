import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import Logo from "../components/Logo";

const Navbar = ({ navLinks = [] }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [statusMessage, setStatusMessage] = useState("Loading...");
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [name, setName] = useState("Loading...");
    const [userPhoto, setUserPhoto] = useState(null);

    // Fetch user data from the backend
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/status.php`, {
                    method: "GET",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" }
                });
                const data = await response.json();
                console.log("User data:", data); // Check what data we received from the backend

                if (data.success) {
                    // Gunakan userName jika name kosong
                    setName(data.name); // Jika name kosong, tampilkan userName
                    setStatusMessage(data.statusMessage || "No status message");
                    setUserPhoto(data.userPhoto || null); // Atur foto user jika ada
                } else {
                    setName("Unknown");
                    setStatusMessage("Unknown");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                setName("Error");
                setStatusMessage("Error");
            }
        };

        fetchUserData();
    }, []);

    // Handle logout
    const logoutSubmit = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/logout.php`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            });
            if (response.ok) {
                navigate("/");
            }
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    // Render navigation links
    const renderNavLinks = () => {
        return navLinks.map((link, index) => (
            <Link
                key={index}
                to={link.path}
                className={`rounded-md px-3 py-2 text-sm font-roboto font-semibold ${
                    location.pathname === link.path
                        ? "bg-orange-900 text-white"
                        : "text-gray-300 hover:bg-orange-700 hover:text-white"
                }`}
            >
                {link.name}
            </Link>
        ));
    };

    // Render user profile photo or initials if no photo
    const renderUserProfile = () => {
        return userPhoto ? (
            <img
                src={`${userPhoto}`}
                alt="Profile"
                className="w-20 h-20 rounded-full mb-2"
            />
        ) : (
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 mb-2">
                {name.charAt(0).toUpperCase()}
            </div>
        );
    };

    return (
        <nav className="bg-gradient-to-r from-orange-600 to-orange-800 shadow-md">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <div className="shrink-0">
                            <Logo classValue="mr-5" />
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-5 flex items-baseline space-x-4">
                                {renderNavLinks()}
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <span className="text-white font-medium text-sm px-5">{name}</span>
                            <button
                                onClick={() => setSidebarOpen(true)}
                                type="button"
                                className="relative flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-300 hover:bg-gray-700"
                            >
                                {userPhoto ? (
                                    <img
                                        src={`data:image/jpeg;base64,${userPhoto}`}
                                        alt="Profile"
                                        className="w-10 h-10 rounded-full border-2 border-white"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700">
                                        {name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </button>

                            {/* Sidebar with slide transition */}
                            <div
                                className={`fixed inset-0 z-10 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out ${
                                    isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                <div
                                    className={`fixed top-0 right-0 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
                                        isSidebarOpen ? "translate-x-0" : "translate-x-full"
                                    }`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="relative px-6 py-4 border-b flex items-center justify-between">
                                        <span className="text-lg font-semibold text-gray-800">Profile</span>
                                        <button
                                            onClick={() => setSidebarOpen(false)}
                                            className="text-gray-600 hover:text-gray-900"
                                        >
                                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                                        </button>
                                    </div>
                                    <div className="flex flex-col items-center mt-6 px-6">
                                        {renderUserProfile()}
                                        <p className="text-sm text-gray-500 italic mt-2 mb-1">{statusMessage}</p>
                                        <span className="text-lg font-semibold text-gray-800">{name}</span>
                                    </div>
                                    <div className="mt-6 border-t pt-4 px-6 flex flex-col gap-2">
                                        <Link
                                            to="/dashboard-user/profile"
                                            className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition duration-300"
                                            onClick={() => setSidebarOpen(false)}
                                        >
                                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A11.954 11.954 0 0112 15c2.486 0 4.782.755 6.879 2.05M12 12a4 4 0 100-8 4 4 0 000 8z" />
                                            </svg>
                                            Your Profile
                                        </Link>
                                        <button
                                            onClick={logoutSubmit}
                                            className="flex items-center text-sm font-medium text-gray-600 hover:text-red-600 transition duration-300"
                                        >
                                            <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                                            </svg>
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setSidebarOpen(!isSidebarOpen)}
                            type="button"
                            className="text-white p-2 hover:bg-orange-700 transition-all duration-300 rounded-md"
                        >
                            {isSidebarOpen ? (
                                <svg className="block w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="block w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className={`md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
                    <div className="space-y-1 px-2 pb-3 pt-2">
                        <div className="flex items-center justify-between mb-4 px-3">
                            <h2 className="text-lg font-semibold text-white">Menu</h2>
                        </div>
                        {navLinks.map((link, index) => (
                            <Link
                                key={index}
                                to={link.path}
                                className={`block rounded-md px-3 py-2 text-base font-medium ${
                                    location.pathname === link.path
                                        ? "bg-orange-900 text-white"
                                        : "text-gray-300 hover:bg-orange-700 hover:text-white"
                                }`}
                                onClick={() => setSidebarOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    
                    {/* Mobile User Profile */}
                    <div className="border-t border-gray-700 pb-3 pt-4">
                        <div className="flex items-center px-5">
                            {userPhoto ? (
                                <img
                                    src={`data:image/jpeg;base64,${userPhoto}`}
                                    alt="Profile"
                                    className="h-10 w-10 rounded-full"
                                />
                            ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-xl font-bold text-gray-700">
                                        {name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div className="ml-3">
                                <div className="text-base font-medium text-white">{name}</div>
                                <div className="text-sm font-medium text-gray-300">{statusMessage}</div>
                            </div>
                        </div>
                        <div className="mt-3 space-y-1 px-2">
                            <Link
                                to="/dashboard-user/profile"
                                className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-orange-700 hover:text-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                Your Profile
                            </Link>
                            <button
                                onClick={() => {
                                    setSidebarOpen(false);
                                    logoutSubmit();
                                }}
                                className="w-full text-left rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-orange-700 hover:text-white"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
