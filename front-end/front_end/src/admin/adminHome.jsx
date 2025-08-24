import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import HeaderAdmin from "../components/HeaderAdmin";
import Footer from "../components/Footer";

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
        label: "Kekerasan",
        data: [12, 19, 3, 5, 2, 8],
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
      },
      {
        label: "Penyerangan",
        data: [5, 15, 8, 2, 10, 6],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
      },
      {
        label: "Perkelahian",
        data: [9, 12, 15, 8, 5, 3],
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
      },
      {
        label: "Ledakan",
        data: [7, 4, 10, 15, 6, 9],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
      {
        label: "Pencurian",
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
          <HeaderAdmin />
        </header>

      {/* Map Section */}
      <div className="p-8">
        <div className="w-full h-[300px] bg-gray-700 flex items-center justify-center text-xl font-bold rounded-lg">
          <iframe
            src="http://localhost:5000/map"
            title="Monitoring Map"
            className="w-full h-full border-0 rounded-lg"
          ></iframe>
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
            onClick={() => navigate(`/detail-admin/${item.id}`)}
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
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default Home;
