import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    address: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          userName: formData.username,
          address: formData.address,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          password: formData.password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        navigate("/"); // ke halaman login
      } else {
        alert(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to server");
    }
  };

  return (
    <div className="bg-[#0f1e2e] w-screen h-full min-h-screen flex items-center justify-center py-10">
      <div className="w-[700px] bg-[#1c2b3a] rounded-2xl shadow-lg p-10 relative">
        <div className="absolute top-5 left-1/2 transform -translate-x-1/2 text-white text-4xl font-bold">
          URSAFE
        </div>

        <h2 className="text-white text-5xl font-bold text-center mt-16 mb-10">
          SIGN UP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { id: "fullName", label: "Full Name", type: "text" },
            { id: "username", label: "Username", type: "text" },
            { id: "address", label: "Address", type: "text" },
            { id: "email", label: "Email Address", type: "email" },
            { id: "phoneNumber", label: "Phone Number", type: "tel" },
            { id: "password", label: "Password", type: "password" },
            { id: "confirmPassword", label: "Confirm Password", type: "password" },
          ].map((field) => (
            <div key={field.id}>
              <label htmlFor={field.id} className="block text-white text-xl mb-2">
                {field.label}
              </label>
              <input
                id={field.id}
                type={field.type}
                value={formData[field.id]}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                placeholder={`Enter ${field.label}`}
                className="w-full px-4 py-2 rounded-lg bg-gray-200 text-black text-lg focus:outline-none"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-xl font-semibold rounded-lg transition"
          >
            SIGN UP
          </button>
        </form>

        <div className="text-center mt-6 text-white text-md">
          Have an account?{" "}
          <button
            onClick={() => navigate("/")}
            className="text-blue-400 hover:underline ml-1"
          >
            Login now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
