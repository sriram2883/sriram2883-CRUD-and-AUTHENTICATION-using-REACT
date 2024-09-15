import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Axios from "axios";
function Signin() {
    const navigate = useNavigate();
    const LogginReq = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const username = data.get("username");
        const password = data.get("password");
        const email = data.get("email");
        Axios.post("http://localhost:3001/login", { username, email, password })
            .then((response) => {
                alert("Login successful");
                navigate('/User');
                localStorage.setItem('token', JSON.stringify(response.data.token));
                localStorage.setItem('user', JSON.stringify(username));
            })
            .catch((error) => {
                alert(error.response.data);
            });
        clearForm();
    };

    const clearForm = () => {
        document.getElementById("LoginForm").reset();
    }

    return (
        <div>
            <h1>SIGN IN HERE</h1>
            <form onSubmit={LogginReq} id="LoginForm">
                <div className="inputs">
                    Username: <input type="text" name="username" placeholder="Username" required />
                    Password: <input type="password" name="password" placeholder="Password" required />
                    Email: <input type="email" name="email" placeholder="Enter Email" required />
                </div>
                <div class="confirmsLog">
                    <button type="submit">LOGIN</button>
                </div>
                <div class="confirms">
                <button onClick={() => navigate("/register")}>REGISTER</button>
                <button onClick={()=>navigate('/adminLogin')}>ADMIN</button>
                </div>
            </form>
        </div>
    );
}

export default Signin;