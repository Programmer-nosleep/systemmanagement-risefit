import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faBars,
  faSignOutAlt,
  faTimes,
  faList,
  faUsers,
  faChalkboard,
  faHome,
  faMoneyBillWave,
  faShoppingCart,
  faChartLine,
  faFileInvoiceDollar,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";

import Logo from "../components/Logo";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isLeftSidebarOpen, setLeftSidebarOpen] = useState(false);

  const [status, setStatus] = useState("Loading...");
  const [userName, setUserName] = useState("Loading...");
  const [userPhoto, setUserPhoto] = useState("");

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/status.php`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = await response.json();
        if (data.success) {
          setUserName(data.name);
          setStatus(data.status);
          setUserPhoto(data.userPhoto || "");
        } else {
          setUserName("Unknown");
          setStatus("Unknown");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserName("Error");
        setStatus("Error");
      }
    }
    fetchUserData();
  }, []);

  async function logoutSubmit() {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/logout.php`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await response.json();
      if (response.ok) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <>
      {(isSidebarOpen || isLeftSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 transition-opacity duration-300"
          onClick={() => {
            setSidebarOpen(false);
            setLeftSidebarOpen(false);
          }}
        ></div>
      )}

      <nav className="bg-gradient-to-r from-orange-600 to-orange-800 w-full h-16 top-0 left-0 right-0 shadow-lg">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 items-center justify-between px-4">
            {/* Tombol Menu Mobile */}
            <button
              className="text-white p-2 hover:bg-orange-700 transition-all duration-300 rounded-md"
              onClick={() => {
                setLeftSidebarOpen((prev) => {
                  if (!prev) setSidebarOpen(false);
                  return !prev;
                });
              }}
            >
              {isLeftSidebarOpen ? (
                <svg className="block w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

            <div className="shrink-0">
              <Logo classValue="mr-5" />
            </div>

            {/* Profile Button Mobile */}
            <div className="flex items-center">
              <span className="hidden md:block text-white font-medium text-sm px-5">
                {userName}
              </span>
              <button
                onClick={() => setSidebarOpen(!isSidebarOpen)}
                type="button"
                className="relative flex items-center rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {userPhoto ? (
                  <img
                    src={`data:image/jpeg;base64,${userPhoto}`}
                    alt="Profile"
                    className="w-10 h-10 rounded-full transition-transform transform hover:scale-105"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xl font-bold text-gray-700">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Left Sidebar Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 w-64 bg-white transform ${
          isLeftSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-30 shadow-xl overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Menu</h2>
            <button
              onClick={() => setLeftSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </button>
          </div>
          
          <div className="space-y-2">
            {[
              { name: "Dashboard", route: "/dashboard", icon: faHome },
              { name: "Admin Finance", route: "/admin-finance", icon: faMoneyBillWave },
              { name: "Purchasing", route: "/purchasing", icon: faShoppingCart },
              { name: "Marketing Sales", route: "/marketing-sales", icon: faChartLine },
              { name: "Management Class", route: "/manage-class", icon: faChalkboard },
              { name: "Accounting", route: "/acounting", icon: faFileInvoiceDollar },
              { name: "Inventory", route: "/inventory", icon: faWarehouse },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.route}
                onClick={() => setLeftSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.route
                    ? "bg-orange-600 text-white"
                    : "text-gray-700 hover:bg-orange-100"
                }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

      {/* Right Sidebar Mobile */}
      <aside
        className={`fixed inset-y-0 right-0 w-64 bg-white transform ${
          isSidebarOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-30 shadow-xl`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Profile</h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FontAwesomeIcon icon={faTimes} className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col items-center">
            {userPhoto ? (
              <img
                src={`data:image/jpeg;base64,${userPhoto}`}
                alt="Profile"
                className="w-24 h-24 rounded-full mb-4"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-gray-700">
                  {userName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{userName}</h3>
            <p className="text-sm text-gray-500 mb-6">{status}</p>

            <div className="w-full space-y-3">
              <Link
                to="/dashboard-user/profile"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-100 rounded-lg transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faUserCircle} className="w-5 h-5 mr-3" />
                <span>Your Profile</span>
              </Link>
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  logoutSubmit();
                }}
                className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-5 h-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
