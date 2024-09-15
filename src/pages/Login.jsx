import React from "react";
import { useNavigate } from "react-router-dom";
function Login() {
    const navigate = useNavigate();
  return (
    <div>
        <h1>Login</h1>
        <button onClick={() => navigate("/register")}>Register</button>
        <button onClick={() => navigate("/signin")}>Signin</button>
        <button onClick={() => navigate("/adminLogin")}>Admin</button>
    </div>
  );
}

export default Login;
