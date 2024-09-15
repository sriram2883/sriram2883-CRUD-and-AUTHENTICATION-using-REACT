import React from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import Axios from "axios";
function Register() {
    const navigate = useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        const username = data.get("username");
        const password = data.get("password");
        const email = data.get("email");
        console.log(username, password, email);
        Axios.post("http://localhost:3001/register", { username, email, password })
            .then((response) => {
                alert("Registration successful");
                navigate('/signin');
            })
            .catch((error) => {
                alert(error.response.data);
            });
        clearForm();
    };

    const clearForm = () => {
        document.getElementById("RegistrationForm").reset();
    };

    return (
        <div>
            <h1>REGISTER HERE</h1>
            <form onSubmit={handleSubmit} id="RegistrationForm">
                <div className="inputs">
                    Username: <input type="text" name="username" placeholder="Username" required />
                    Password: <input type="password" name="password" placeholder="Password" required />
                    Email: <input type="email" name="email" placeholder="Enter Email" required />
                </div>
                <div className="confirmsLog">
                        <button type="submit">REGISTER</button>
                </div>
                <div className="confirms">
                <button onClick={() => navigate("/signin")}>CLICK TO LOGIN</button>
                <button onClick={()=>navigate('/adminLogin')}>ADMIN</button>
                </div>
            </form>
            
        </div>
    );
}

export default Register;