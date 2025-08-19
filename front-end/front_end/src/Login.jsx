import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
//testetstes
    try {
      const res = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: username, 
          password: password
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Login successful!");
        if (data.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="bg-[#0f1e2e] w-screen h-screen flex items-center justify-center">
      <div className="w-[700px] bg-[#1c2b3a] rounded-2xl shadow-lg p-10 relative">
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold">
          URSAFE
        </div>

        <div className="flex items-center justify-center mt-16 mb-10">
          <h2 className="text-white text-5xl font-bold">LOGIN</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-white text-xl mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 text-black text-lg focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-white text-xl mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-2 rounded-lg bg-gray-200 text-black text-lg focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold rounded-lg transition"
          >
            LOGIN
          </button>
        </form>

        <div className="text-center mt-6 text-white text-md">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-blue-400 hover:underline ml-1"
          >
            Sign up now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
