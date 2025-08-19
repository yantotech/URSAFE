import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Home = () => {
  const navigate = useNavigate();
  const [cctvList, setCctvList] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/cctv")
      .then((res) => res.json())
      .then((data) => setCctvList(data))
      .catch((err) => console.error(err));
  }, []);

  // Dummy data kejadian (April - September)
  const dummyData = {
    labels: ["April", "Mei", "Juni", "Juli", "Agustus", "September"],
    datasets: [
      {
        label: "Kecelakaan",
        data: [12, 19, 3, 5, 2, 8],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Kebakaran",
        data: [5, 15, 8, 2, 10, 6],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
      },
      {
        label: "Kriminalitas",
        data: [9, 12, 15, 8, 5, 3],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Kerusakan Infrastruktur",
        data: [7, 4, 10, 15, 6, 9],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Kerusuhan",
        data: [3, 8, 6, 4, 9, 12],
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
      },
    ],
  };

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSearch = () => {
    console.log(`Filter data dari ${fromDate} sampai ${toDate}`);
    // TODO: Hubungkan filter ini ke data grafik
  };

  return (
    <div className="bg-[#0f1e2e] min-h-screen text-white flex flex-col">

      {/* HEADER */}
    <header className="bg-[#1c2b3a] shadow-lg">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-white">URSAFE</span>
        <span className="text-red-500 text-xl">📍</span>
        </div>
        {/* Navigation */}
        <nav className="flex space-x-8">
        <button
            onClick={() => navigate("/home")}
            className={`text-lg font-medium transition-colors duration-200 ${
            window.location.pathname === "/home"
                ? "text-blue-400"
                : "text-gray-200 hover:text-white"
            }`}
        >Home</button>
        <button
            onClick={() => navigate("/report")}
            className={`text-lg font-medium transition-colors duration-200 ${
            window.location.pathname === "/report"
                ? "text-blue-400"
                : "text-gray-200 hover:text-white"
            }`}
        >Report</button>
        <button
            onClick={() => navigate("/profile")}
            className={`text-lg font-medium transition-colors duration-200 ${
            window.location.pathname === "/profile"
                ? "text-blue-400"
                : "text-gray-200 hover:text-white"
            }`}
        >Profile</button>
        <button
            onClick={() => navigate("/profile")}
            className={`text-lg font-medium transition-colors duration-200 ${
            window.location.pathname === "/profile"
                ? "text-blue-400"
                : "text-gray-200 hover:text-white"
            }`}
        >Maintenance</button>
        </nav>
    </div>
    </header>

      {/* Map Section */}
      <div className="p-8">
        <div className="w-full h-[300px] bg-gray-700 flex items-center justify-center text-xl font-bold rounded-lg">
          Map (Google Map API Slot)
        </div>
      </div>

      {/* Grafik & Filter */}
      <div className="px-8 grid grid-cols-4 gap-8">
        <div className="col-span-3 bg-[#1c2b3a] rounded-lg p-5 shadow-lg">
          <h2 className="text-xl mb-4 font-bold">Data Kejadian</h2>
          <Line data={dummyData} />
        </div>

        <div className="bg-[#1c2b3a] rounded-lg p-5 shadow-lg">
          <h2 className="font-bold mb-3">SEARCH DATA</h2>
          <label className="block text-sm mb-1">From</label>
          <input
            type="date"
            className="w-full mb-3 p-2 rounded text-black"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label className="block text-sm mb-1">To</label>
          <input
            type="date"
            className="w-full mb-3 p-2 rounded text-black"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="w-full bg-blue-500 py-2 rounded hover:bg-blue-600"
          >
            Search
          </button>
        </div>
      </div>

      {/* Search Location */}
      <div className="px-8 mt-8">
        <input
          type="text"
          placeholder="Search Location"
          className="w-full p-3 rounded text-black mb-5"
        />
        
    <div className="px-8 mt-8">
      <div className="flex flex-warp justify-center gap-8">
        {cctvList.map((item) => (
          <div
            key={item.id}
            className="bg-[#1c2b3a] w-80 p-6 rounded-xl cursor-pointer hover:bg-[#25384d] shadow-lg flex flex-col items-center transition-all duration-300"
            onClick={() => navigate(`/detail/${item.id}`)}
          >
            <FaMapMarkerAlt className="text-red-500 text-5xl mb-4" />
            <h3 className="font-bold text-lg mb-1 text-center">{item.title}</h3>
            <p className="text-sm text-gray-300 mb-3">{item.location}</p>
            <button className="bg-blue-500 px-5 py-2 rounded hover:bg-blue-600">
              Detail
            </button>
          </div>
        ))}
      </div>
    </div>
    </div>

      {/* Footer */}
      <footer className="bg-[#1c2b3a] mt-8 p-6 text-center text-sm text-gray-400">
        <p className="font-bold text-white">URSAFE 🚨 - Urban Risk Surveillance and Alert for Emergency</p>
        <p className="mt-2">
          URSAFE merupakan sistem cerdas yang dirancang untuk mendukung pemerintah, otoritas kota, 
          sekaligus memberikan perlindungan langsung kepada masyarakat dengan memanfaatkan perangkat yang tersebar di berbagai titik strategis.
        </p>
      </footer>
    </div>
  );
};

export default Home;
