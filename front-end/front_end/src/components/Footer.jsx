import {useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#1c2b3a] mt-8 p-6 text-justify text-sm text-gray-400">
        <p className="font-bold text-white text-center">URSAFE 🚨 - Urban Risk Surveillance and Alert for Emergency</p>
        <p className="mt-2">
        URSAFE merupakan sistem cerdas yang dirancang untuk mendukung pemerintah, otoritas kota, sekaligus memberikan perlindungan langsung kepada masyarakat, dengan memanfaatkan perangkat yang tersebar di berbagai titik strategis, sistem ini mampu memantau kondisi lingkungan secara menyeluruh dan merespons berbagai situasi darurat secara cepat dan tepat. URSAFE secara otomatis mengenali kejadian berisiko tinggi, seperti kecelakaan pada jalan, tindakan kriminal, kebakaran, kerusuhan, hingga kerusakan parah pada infrastruktur. Melalui deteksi yang akurat dan respon yang terkoordinasi, sistem ini membantu mempercepat penanganan, mengurangi risiko, dan menciptakan rasa aman bagi masyarakat.
        </p>
      </footer>
  );
}