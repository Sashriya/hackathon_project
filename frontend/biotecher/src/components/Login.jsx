import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await axios.post("http://localhost:8000/login", {
      email,
      password,
    });

    if (res.data.access_token) {
      localStorage.setItem("token", res.data.access_token);
      alert("Login successful");
    } else {
      alert(res.data.error);
    }
  };

  return (
    <div>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password"
        onChange={(e) => setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );
};

export default Login;