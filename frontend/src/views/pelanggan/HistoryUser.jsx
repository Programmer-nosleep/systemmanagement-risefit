import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";

const HistoryUser = () => {
    const [loading, setLoading] = useState(true);
    
    return (
        <div className="bg-gray-100 flex flex-col h-screen relative overflow-hidden">
            <Navbar
                navLinks={[
                    { name: "Overview", path: "/dashboard-user" },
                    { name: "Lihat Barang", path: "/lihat-barang" },
                    { name: "Booking Kelas", path: "/booking-kelas" },
                    { name: "Riwayat", path: "/riwayat" },
                ]}
            />
        </div>
    );
}

export default HistoryUser;