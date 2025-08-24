// src/components/HistoryLaporan.jsx
import React, { useState, useEffect } from "react";

const HistoryLaporan = () => {
  // Dummy data untuk testing tampilan
  const [laporan, setLaporan] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) return;
    // ===== SLOT INTEGRASI BACKEND =====
    // Nanti ganti ini dengan fetch ke backend sesuai user login
    // Contoh:
    fetch(`http://localhost:3001/api/profile/${userId}/reports`)
      .then(res => res.json())
      .then(data => setLaporan(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="bg-[#1c2b3c] h-full p-4 overflow-y-auto">
      <h2 className="text-white text-xl font-bold mb-4">History Laporan</h2>

      {laporan.length === 0 ? (
        <p className="text-white text-center mt-10">
          Anda Belum Pernah Membuat Laporan Saat ini
        </p>
      ) : (
        <div className="space-y-3">
          {laporan.map((item) => (
            <button
              key={item.id}
              className="bg-[#334756] h-[90px] px-4 rounded-lg p-3 flex flex-row justify-center shadow-md w-full hover:bg-[#445d73] transition-colors text-left"
            >
              {/* Ikon Panah */}
              <div className="text-white text-2xl mr-3">❮</div>

              {/* Isi Laporan */}
              <div className="text-white">
                <p className="text-sm font-semibold">{item.jenisKejadian}</p>
                <p className="text-xs">{item.lokasiKejadian}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default HistoryLaporan;
