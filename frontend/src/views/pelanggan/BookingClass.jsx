import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/Navbar";

const BookingClass = () => {
  const [kelasList, setKelasList] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/booking_kelas.php`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => setKelasList(data))
      .catch((err) => console.error(err));
  }, []);

  const handleBooking = (kelas_id) => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/booking_kelas.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ kelas_id }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message);
        if (data.success) {
          setKelasList((prev) =>
            prev.map((kelas) =>
              kelas.id === kelas_id
                ? { ...kelas, slot_tersedia: kelas.slot_tersedia - 1 }
                : kelas
            )
          );
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="bg-gray-100 flex flex-col h-screen">
      <Navbar
        navLinks={[
          { name: "Overview", path: "/dashboard-user" },
          { name: "Lihat Barang", path: "/lihat-barang" },
          { name: "Booking Kelas", path: "/booking-kelas" },
          { name: "Riwayat", path: "/riwayat" },
        ]}
      />

      <main className="flex items-center justify-center bg-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-lg w-full p-4 mx-auto">
          {kelasList.map((kelas) => {
            // Map nama_kelas to ilustrasi dengan gambar dari URL
            const imageMap = {
              "Body Building": "https://images.unsplash.com/photo-1607343190406-93a9bc202a39", // Contoh gambar Body Building
              "Angkat Barbel": "https://images.unsplash.com/photo-1583394541056-4f623007f2d3", // Contoh gambar Angkat Barbel
              "Drible": "https://images.unsplash.com/photo-1595424284024-e63488f12f34", // Contoh gambar Drible
              "Yoga": "https://images.unsplash.com/photo-1515338454037-d84fbc59f713", // Contoh gambar Yoga
            };

            const imageUrl = imageMap[kelas.nama_kelas]; // Gambar default jika kelas tidak ditemukan

            // Slot status
            let slotStatus = "";
            let slotColor = "";

            if (kelas.slot_tersedia <= 0) {
              slotStatus = "Penuh";
              slotColor = "bg-gray-300 text-gray-500";
            } else if (kelas.slot_tersedia <= 3) {
              slotStatus = "Hampir Penuh";
              slotColor = "bg-red-100 text-red-600";
            } else {
              slotStatus = "Tersedia";
              slotColor = "bg-green-100 text-green-600";
            }

            const cardClass = kelas.slot_tersedia <= 0 ? "opacity-50 pointer-events-none" : ""; // Class untuk card yang habis slotnya

            return (
                <div
                key={kelas.id}
                className={`bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col ${cardClass} relative`}
              >
                <img
                  src={imageUrl}
                  alt={kelas.nama_kelas}
                  className="h-40 w-full object-cover"
                />
                <div className="p-6 flex flex-col justify-between flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3 text-center">
                    {kelas.nama_kelas}
                  </h3>
            
                  <div className="text-center text-gray-600 mb-3">
                    <p className="mb-1">
                      <span className="font-medium">Jadwal:</span>{" "}
                      {new Date(kelas.jadwal).toLocaleString("id-ID")}
                    </p>
                    <p
                      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${slotColor}`}
                    >
                      {slotStatus} ({kelas.slot_tersedia} slot)
                    </p>
                  </div>
            
                  <button
                    onClick={() => handleBooking(kelas.id)}
                    disabled={kelas.slot_tersedia <= 0}
                    className={`w-full mt-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                      kelas.slot_tersedia <= 0
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-orange-600 hover:bg-orange-700 text-white"
                    }`}
                  >
                    {kelas.slot_tersedia <= 0 ? "Penuh" : "Booking"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default BookingClass;
