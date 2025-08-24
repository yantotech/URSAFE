import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Icon marker custom biar muncul
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export const ReportUser = () => {
  const [formData, setFormData] = useState({
    jenisKejadian: "",
    lokasiKejadian: "",
    waktuKejadian: "",
    deskripsiKejadian: "",
    latitude: null,
    longitude: null,
  });

  const [showPopup, setShowPopup] = useState(false);
  const [useMap, setUseMap] = useState(false);

  const jenisKejadianOptions = [
    "Kecelakaan",
    "Kerusuhan",
    "Kriminalitas",
    "Kebakaran",
    "Kerusakan Infrastruktur",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Geocoding
  const getCoordinatesFromAddress = async (address) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/geocode/search?q=${encodeURIComponent(address)}`
      );
      const data = await res.json();
      if (data.length > 0) {
        setFormData((prev) => ({
          ...prev,
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        }));
        return true;
      }
      return false;
    } catch (err) {
      console.error("Gagal geocoding:", err);
      return false;
    }
  };

  // Reverse Geocoding
  const getAddressFromCoordinates = async (lat, lon) => {
    try {
      const res = await fetch(
        `http://localhost:3001/api/geocode/reverse?lat=${lat}&lon=${lon}`
      );
      const data = await res.json();
      if (data && data.display_name) {
        setFormData((prev) => ({
          ...prev,
          lokasiKejadian: data.display_name,
        }));
      }
    } catch (err) {
      console.error("Gagal reverse geocoding:", err);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!useMap && formData.lokasiKejadian) {
    const ok = await getCoordinatesFromAddress(formData.lokasiKejadian);
    if (!ok) {
      alert("Alamat tidak ditemukan. Coba perjelas alamat atau pilih dari map.");
      return;
    }
  } else if (useMap && (!formData.latitude || !formData.longitude)) {
    alert("Silakan klik lokasi di map untuk menentukan titik koordinat.");
    return;
  }

  setShowPopup(true);
};

const handleFinish = async () => {
  try {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Anda harus login dulu sebelum membuat laporan.");
      return;
    }

    const payload = {
      userId,
      jenisKejadian: formData.jenisKejadian,
      lokasiKejadian: formData.lokasiKejadian,
      latitude:
        formData.latitude !== null ? Number(formData.latitude) : null,
      longitude:
        formData.longitude !== null ? Number(formData.longitude) : null,
      waktuKejadian: formData.waktuKejadian,
      deskripsiKejadian: formData.deskripsiKejadian,
    };

    console.log("Payload:", payload);

    const res = await fetch("http://localhost:3001/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error || "Gagal menyimpan data");
    }

    // reset form
    setFormData({
      jenisKejadian: "",
      lokasiKejadian: "",
      waktuKejadian: "",
      deskripsiKejadian: "",
      latitude: null,
      longitude: null,
    });

    setShowPopup(false);
  } catch (error) {
    console.error("Gagal kirim report:", error);
    alert(error.message || "Gagal kirim report");
  }
};

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          latitude: lat,
          longitude: lng,
        }));
        getAddressFromCoordinates(lat, lng);
      },
    });

    return formData.latitude && formData.longitude ? (
      <Marker position={[formData.latitude, formData.longitude]} icon={markerIcon} />
    ) : null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1e2e] text-white">
      <Header />

      {/* FORM */}
      <main className="flex-grow flex justify-center items-center px-4 py-10">
        <form
          onSubmit={handleSubmit}
          className="bg-[#1c2b3c] rounded-lg shadow-lg w-full max-w-2xl p-8 space-y-6"
        >
          <h2 className="text-3xl font-bold text-center mb-6">Form Report</h2>

          {/* Jenis Kejadian */}
          <div>
            <label className="block text-lg font-semibold mb-2">Jenis Kejadian</label>
            <select
              value={formData.jenisKejadian}
              onChange={(e) => handleInputChange("jenisKejadian", e.target.value)}
              className="w-full p-3 pr-10 bg-[#334756] rounded-lg text-white"
            >
              <option value="">Pilih Jenis Kejadian</option>
              {jenisKejadianOptions.map((opt, idx) => (
                <option key={idx} value={opt} className="bg-[#334756]">
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Lokasi */}
          <div>
            <label className="block text-lg font-semibold mb-2">Lokasi Kejadian</label>
            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={() => setUseMap(false)}
                className={`px-4 py-2 rounded-lg ${
                  !useMap ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                Input Manual
              </button>
              <button
                type="button"
                onClick={() => setUseMap(true)}
                className={`px-4 py-2 rounded-lg ${
                  useMap ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                Pilih dari Map
              </button>
            </div>

            {!useMap ? (
              <input
                type="text"
                placeholder="Masukkan alamat lokasi"
                value={formData.lokasiKejadian}
                onChange={(e) => handleInputChange("lokasiKejadian", e.target.value)}
                className="w-full p-3 bg-[#334756] rounded-lg text-white"
              />
            ) : (
              <div className="h-64 w-full rounded-lg overflow-hidden">
                <MapContainer
                  center={[-6.2, 106.8]}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="http://osm.org/copyright">OSM</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationMarker />
                </MapContainer>
              </div>
            )}
          </div>

          {/* Waktu Kejadian */}
          <div>
            <label className="block text-lg font-semibold mb-2">Waktu Kejadian</label>
            <input
              type="time"
              value={formData.waktuKejadian}
              onChange={(e) => handleInputChange("waktuKejadian", e.target.value)}
              className="w-full p-3 bg-[#334756] rounded-lg text-white"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-lg font-semibold mb-2">Deskripsi Kejadian</label>
            <textarea
              rows={5}
              value={formData.deskripsiKejadian}
              onChange={(e) => handleInputChange("deskripsiKejadian", e.target.value)}
              className="w-full p-3 bg-[#334756] rounded-lg text-white resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-xl font-semibold rounded-lg transition"
          >
            SUBMIT
          </button>
        </form>
      </main>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#1c2b3c] p-8 rounded-lg shadow-lg text-center space-y-4 w-80">
            <h2 className="text-2xl font-bold text-green-400">Report Berhasil!</h2>
            <button
              onClick={handleFinish}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
            >
              Selesai
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ReportUser;
