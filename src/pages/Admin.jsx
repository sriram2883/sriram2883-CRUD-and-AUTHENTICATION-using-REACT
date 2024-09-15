import React, { useEffect } from "react";
import AdminLoadedData from '../components/AdminComponents/AdminLoadedData.jsx'
import AdminSingleTransaction from '../components/AdminComponents/AdminSingleTransaction.jsx'
import UserData from "../components/AdminComponents/UserData.jsx";
import Form from "../components/Form";
import UpdateForm from "../components/UpdateForm";
import { useState } from "react";
import './User.css';
import { useNavigate } from "react-router-dom";
function User() {
    const navigate = useNavigate();
    var arr = [AdminLoadedData, Form, AdminSingleTransaction, UpdateForm, UserData];
    var [I, setI] = useState(0);
    useEffect(() => {
        setI(0);
    }, []);
    var logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    }
    var token = JSON.parse(localStorage.getItem('token'));
    var user = JSON.parse(localStorage.getItem('user'));


    var Component = arr[I];
    return (
        <>
            <div>
                <div class="logout" id="logout">
                    <button id="logoutbtn" onClick={logout}><i class="material-icons">logout</i>Logout</button>
                </div>
                <h1>TRANSACTION DATABASE</h1>
                <div className="button-group">
                    <button onClick={() => { setI(0); }} ><i class="material-icons">search</i> View All Transactions</button>
                    <button onClick={() => { setI(1); }}><i class="material-icons">add</i> Add Transaction</button>
                    <button onClick={() => { setI(2); }}><i class="material-icons">visibility</i> Read Transaction</button>
                    <button onClick={() => { setI(3); }}><i class="material-icons">edit</i> Update Transaction</button>
                    <button onClick={() => { setI(4); }}><i class="material-icons" id="listicon">lists</i>User List</button>
                </div>
                <div>
                    <Component setI={setI} />
                </div>
            </div>
        </>
    );
}

export default User;