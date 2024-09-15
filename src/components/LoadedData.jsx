import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import '../pages/User.css';
import { useRef } from "react";
function LoadedData() {
    const [transactions, setTransactions] = useState([]);
    const logoutPrompt = useRef(false);
    const navigate = useNavigate();
    const fetchTransactions = () => {
        const token = JSON.parse(localStorage.getItem("token"));
        const url = "http://localhost:3001/transactions";

        Axios.get(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            if (response.status === 200 && response.request.readyState === 4) {
                setTransactions(response.data);
            }

        })
        .catch((error) => {
            console.error("Error fetching transactions:", error);
            if(logoutPrompt.current) return;
            navigate("/");
            alert("Please login again");
            logoutPrompt.current = true;
        });
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const deleteTransaction = (id) => {
        const token = JSON.parse(localStorage.getItem("token"));
        const url = `http://localhost:3001/transactions/${parseInt(id)}`;

        console.log("Attempting to delete transaction with ID:", id); 

        Axios.delete(url, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            if (response.status === 200) {
                console.log(`Transaction with ID: ${id} deleted successfully.`);
                fetchTransactions();
            } else {
                console.error(`Failed to delete transaction with ID: ${id}. Status: ${response.status}`);
            }
        })
        .catch((error) => {
            console.error(`Error deleting transaction with ID: ${id}`, error);
        });
    };

    return (
        <div>
            <div className="Table" id="Table">
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>CUSTOMER ID</th>
                            <th>Transaction Date</th>
                            <th>Transaction Amount</th>
                            <th>Transaction Status</th>
                            <th>Transaction Type</th>
                            <th>Currency</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody id="TableContent">
                        {transactions.map((transaction) => (
                            <tr key={transaction.transaction_id} id={transaction.transaction_id}>
                                <td>{transaction.transaction_id}</td>
                                <td>{transaction.customer_id}</td>
                                <td>{transaction.transaction_date}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.status}</td>
                                <td>{transaction.payment_method}</td>
                                <td>{transaction.currency}</td>
                                <td>
                                    <button className="btn btn-danger" onClick={() => deleteTransaction(transaction.transaction_id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LoadedData;
