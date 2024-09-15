import React, { useEffect, useRef, useState } from "react";
import Axios from "axios";
import '../pages/User.css';

function SingleTransaction({ setI }) {
    const [transaction, setTransaction] = useState(null);
    const token = JSON.parse(localStorage.getItem("token"));
    const promptShown = useRef(false);
    useEffect(()=>{
    if (promptShown.current) return;
    promptShown.current=true;
    const id = prompt("Enter the transaction ID");
    
    if (!id || isNaN(id)) {
        alert("Please enter a valid transaction ID");
        setI(0);
        return;
    }
    const url = `http://localhost:3001/transactions/${id}`;
    Axios.get(url, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then((response) => {
        if (response.status === 200) {
            setTransaction(response.data);
        } else {
            console.log(`Unexpected response status: ${response.status}`);
        }
    }).catch((error) => {
        console.log("Error fetching transaction:", error);
    });
    }, [setI, token]);
    const deleteTransaction = (id) => {
        const deleteUrl = `http://localhost:3001/transactions/${parseInt(id)}`;
        console.log("Attempting to delete transaction with ID:", id);

        Axios.delete(deleteUrl, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then((response) => {
            if (response.status === 200) {
                console.log(`Transaction with ID: ${id} deleted successfully.`);
                setI(0);
            } else {
                console.error(`Failed to delete transaction with ID: ${id}. Status: ${response.status}`);
            }
        })
        .catch((error) => {
            console.error(`Error deleting transaction with ID: ${id}`, error);
        });
    };

    return (
        <div className="Table" id="Table">
            {transaction ? (
                <table>
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Customer ID</th>
                            <th>Transaction Date</th>
                            <th>Transaction Amount</th>
                            <th>Transaction Status</th>
                            <th>Transaction Type</th>
                            <th>Currency</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody className="TableContent" id="TableContent">
                        <tr key={transaction[0].transaction_id}>
                            <td>{transaction[0].transaction_id}</td>
                            <td>{transaction[0].customer_id}</td>
                            <td>{transaction[0].transaction_date}</td>
                            <td>{transaction[0].amount}</td>
                            <td>{transaction[0].status}</td>
                            <td>{transaction[0].payment_method}</td>
                            <td>{transaction[0].currency}</td>
                            <td>
                                <button className="btn btn-danger" onClick={() => deleteTransaction(transaction[0].transaction_id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <p>No transaction found.</p>
            )}
        </div>
    );
}

export default SingleTransaction;
