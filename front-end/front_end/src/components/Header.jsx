import {useNavigate } from "react-router-dom";
import IkonCCTV from "../IkonCCTV.svg";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="bg-[#1c2b3a] shadow-lg">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
        <span className="text-2xl font-bold text-white">URSAFE</span>
        <img src={IkonCCTV} alt="Logo" className="w-6 h-6" />
        </div>
        {/* Navigation */}
        <nav className="flex space-x-8">
        <button
            onClick={() => navigate("/home")}
            className={`text-lg font-medium transition-colors duration-200 ${
            window.location.pathname === "/home" || window.location.pathname.startsWith("/detail")
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
        </nav>
    </div>
    </header>


    // <header className="bg-[#334756] px-8 py-4 flex justify-between items-center">
    //   {/* Logo */}
    //   <div className="flex items-center space-x-2">
    //     <h1 className="text-3xl font-bold">URSAFE</h1>
    //     <div className="w-3 h-3 bg-red-600 rounded"></div>
    //   </div>

    //   {/* Menu */}
    //   <nav className="flex space-x-8">
    //     <Link
    //       to="/home"
    //       className={`text-xl ${
    //         location.pathname === "/home" ? "text-blue-400" : "text-gray-200"
    //       } hover:text-white`}
    //     >
    //       Home
    //     </Link>
    //     <Link
    //       to="/report-user"
    //       className={`text-xl ${
    //         location.pathname === "/report-user" ? "text-blue-400" : "text-white"
    //       } hover:text-blue-400`}
    //     >
    //       Report
    //     </Link>
    //     <Link
    //       to="/profile"
    //       className={`text-xl ${
    //         location.pathname === "/profile" ? "text-blue-400" : "text-white"
    //       } hover:text-blue-400`}
    //     >
    //       Profile
    //     </Link>
    //   </nav>

    //   {/* Icon */}
    //   <img src={IkonCCTV} alt="Account" className="w-8 h-8" />
    // </header>
  );
}
