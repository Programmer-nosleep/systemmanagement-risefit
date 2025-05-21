import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser, faUpload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [comment, setComment] = useState("");
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(""); // Untuk menangani error password
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/status.php`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setFullName(data.name);
        setUsername(data.userName);
        setComment(data.statusMessage || "");
        setPreview(data.userPhoto || null);
        setPhone(data.phone || "");
      }
    }
    fetchData();
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    if (newPassword && newPassword.length < 6) {
      setPasswordError("Password harus memiliki minimal 6 karakter.");
      return;
    }

    const formData = new FormData();
    formData.append("id_name", fullName);
    formData.append("status_message", comment);
    formData.append("nomor_telepon", phone);
    formData.append("newPassword", newPassword); // Menambahkan password baru
    if (photo) {
      formData.append("photo", photo);
    }

    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/backoffice/update_profile.php`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const result = await response.json();
    if (result.success) {
      alert("Profil berhasil diperbarui.");
      navigate("/dashboard-user");
    } else {
      alert("Gagal memperbarui profil.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-500 hover:text-blue-600 transition"
        >
          <FontAwesomeIcon icon={faArrowLeft} className="text-xl" />
        </button>
        <div className="bg-blue-50 md:w-1/3 p-6 flex flex-col items-center gap-6">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-28 h-28 rounded-full object-cover shadow-lg ring-4 ring-blue-200"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 ring-4 ring-gray-300">
              <FontAwesomeIcon icon={faUser} className="text-4xl" />
            </div>
          )}

          {/* Upload File */}
          <div className="w-full text-center">
            <label className="flex flex-col items-center gap-2 bg-white border-2 border-dashed border-blue-300 rounded-lg px-4 py-3 cursor-pointer hover:bg-blue-50 transition">
              <FontAwesomeIcon icon={faUpload} className="text-blue-500 text-xl" />
              <span className="text-sm text-gray-600">Unggah Foto Baru</span>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </label>
            {photo && (
              <p className="mt-2 text-xs text-gray-500">{photo.name}</p>
            )}
          </div>
        </div>

        <div className="p-8 md:w-2/3 flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Perbarui Profil</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Nama lengkap"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">No. Telepon</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Password Baru (opsional)</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                  placeholder="Lupa password"
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col">
              <div>
                <label className="text-sm font-medium text-gray-700">Status Pribadi</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={6}
                  className="h-full mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none transition"
                  placeholder="Tulis sesuatu tentang dirimu..."
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition duration-200 shadow-md"
          >
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
