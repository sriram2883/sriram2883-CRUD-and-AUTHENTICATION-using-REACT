import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import  Axios  from "axios";
function AdminLogin() {
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const username = data.get("username");
        const password = data.get("password");
        const email = data.get("email");
        Axios.post("http://localhost:3001/admin", { username, email, password })
            .then((response) => {
                clearForm();
                alert("Login successful");
                navigate('/admin');
                localStorage.setItem('token', JSON.stringify(response.data.token));
                localStorage.setItem('user', JSON.stringify(username));
            })
            .catch((error) => {
                alert(error);
            });
    };

    const clearForm = () => {
        document.getElementById("AdminLoginForm").reset();
    };

    return (
        <div>
            <h1>ADMIN LOGIN</h1>
            <form onSubmit={handleSubmit} id="AdminLoginForm">
                <div className="inputs">
                    Username: <input type="text" name="username" placeholder="Username" required />
                    Password: <input type="password" name="password" placeholder="Password" required />
                    Email: <input type="email" name="email" placeholder="Enter Email" required />
                </div>
                <div className="confirmsLog">
                    <button type="submit">LOGIN</button>
                </div>
                <div className="confirms">
                <button onClick={() => navigate("/register")}>USER REGISTRATION</button>
                <button onClick={()=>navigate('/signin')}>USER SIGNIN</button>
                </div>
            </form>
        </div>
    );
}

export default AdminLogin;