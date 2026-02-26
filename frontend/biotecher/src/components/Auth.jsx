import React, { useState } from "react";
import axios from "axios";

const Auth = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post("http://localhost:8000/login", {
          email,
          password,
        });

        localStorage.setItem("token", res.data.access_token);
        onLogin(); // move to dashboard
      } else {
        // REGISTER
        await axios.post("http://localhost:8000/register", {
          name,
          email,
          password,
        });

        alert("Registration successful! Please login.");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.detail || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96 space-y-6">
        <h2 className="text-2xl font-bold text-center">
          {isLogin ? "Student Login" : "Student Register"}
        </h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 border rounded-xl"
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-xl"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white p-3 rounded-xl"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p
          className="text-sm text-center cursor-pointer text-blue-500"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
};

export default Auth;