// src/pages/ProfileUser.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HistoryUser from "../components/HistoryUser";

const ProfileUser = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    address: "",
    email: "",
    phoneNumber: "",
  });

  // ===== SLOT ambil data user dari backend =====
  useEffect(() => {
    // Contoh integrasi nanti:
    // fetch(`/api/users/${userId}`)
    //   .then(res => res.json())
    //   .then(data => setFormData(data))
    //   .catch(err => console.error(err));

    // Dummy data untuk tampilan awal
    setFormData({
      fullName: "Budiman",
      userName: "abcdefg",
      address: "Lokasi A",
      email: "abc@gmail.com",
      phoneNumber: "08XXXXXXXXXX",
    });
  }, []);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // ===== SLOT untuk update profil ke backend =====
    // fetch(`/api/users/${userId}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // })
    //   .then(res => res.json())
    //   .then(data => alert("Profil berhasil diperbarui!"))
    //   .catch(err => console.error(err));

    console.log("Data disimpan:", formData);
  };

  return (
    <div className="bg-[#0f1e2e] min-h-screen text-white flex flex-col">
      {/* HEADER */}
      <header className="bg-[#1c2b3a] shadow-lg">
        <Header />
      </header>

      {/* Konten */}
      <div className="flex flex-1 bg-[#0f1e2e] text-white">
        {/* Bagian Kiri: Form Profil (Lebar) */}
        <div className="flex-[3] p-8">
          <h1 className="text-4xl font-bold mb-6">Profile</h1>
          <div className="grid grid-cols-2 gap-6">
            {/* Nama */}
            <div>
              <label className="block mb-2">Nama</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => handleChange("fullName", e.target.value)}
                className="w-full p-3 rounded-lg bg-[#334756] text-white"
              />
            </div>
            {/* Username */}
            <div>
              <label className="block mb-2">Username</label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => handleChange("userName", e.target.value)}
                className="w-full p-3 rounded-lg bg-[#334756] text-white"
              />
            </div>
            {/* Domisili */}
            <div>
              <label className="block mb-2">Domisili</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="w-full p-3 rounded-lg bg-[#334756] text-white"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full p-3 rounded-lg bg-[#334756] text-white"
              />
            </div>
            {/* Nomor Telepon */}
            <div>
              <label className="block mb-2">Nomor Telepon</label>
              <input
                type="text"
                value={formData.phoneNumber}
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                className="w-full p-3 rounded-lg bg-[#334756] text-white"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="mt-6 px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Simpan Perubahan
          </button>
        </div>

        {/* Bagian Kanan: History Laporan (Sempit, scrollable) */}
        <div className="flex-[1.2] border-l border-gray-700 p-6 overflow-y-auto">
          <HistoryUser />
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default ProfileUser;
