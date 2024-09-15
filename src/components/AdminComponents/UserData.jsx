import  Axios  from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import '../../pages/User.css';
function UserData({setI}){
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const promptShown = useRef('false');
    const fetchData=()=>{
        const token = JSON.parse(localStorage.getItem('token'));
        if(!token){
            if(promptShown.current) return;
            promptShown.current=true;
            localStorage.clear()
            navigate('/');
        }
        const url = 'http://localhost:3001/admin/users'
        Axios.get(url,{
            headers: {
                "Authorization": `Bearer ${token}`,
                "username":JSON.parse(localStorage.getItem('user'))
            } 
        })
        .then((response)=>{
            setUsers(response.data);
        })
        .catch((error)=>{
            console.log(`error in fetching users`,error)
            setI(0);
        })
    }
    const deleteUser=(id)=>{
        const url= `http://localhost:3001/admin/users/${id}`;
        const token = JSON.parse(localStorage.getItem('token'));
        Axios.delete(url,{
            headers: {
                "Authorization": `Bearer ${token}`,
                "username":JSON.parse(localStorage.getItem('user'))
            }
        
    })
        .then((response)=>{
            if(response.status==200){
                alert("User Deleted Successfully");
                fetchData();
            }
        })
        .catch((error)=>{
            console.log('error in deleting user',error);
        })
    }
    useEffect(()=>{
        fetchData();
    },[])

    return(
        <div>
            <div class="Table" id="UsersTable">
            <table>
                <thead>
                    <th>username</th>
                    <th>email</th>
                    <th>Delete</th>
                </thead>
                <tbody class="UserTableContent" id="UserTableContent">
                    {   users.map((user)=>(
                            <tr key={user.username} id={user.username}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td><button className="btn btn-danger" onClick={() => deleteUser(user.username)}>Delete</button></td>
                            </tr>
                            ))
                    }
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default UserData;