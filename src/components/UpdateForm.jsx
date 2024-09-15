import React, { useEffect, useState, useRef } from "react";
import Axios from "axios";
import '../pages/User.css';

function UpdateForm({ setI }) {
    const [transaction, setTransaction] = useState(null);
    const [formValues, setFormValues] = useState({
        transaction_id: "",
        customer_id: "",
        amount: "",
        status: "",
        payment_method: "",
        currency: ""
    });
    const promptShown = useRef(false);
    const token = JSON.parse(localStorage.getItem("token"));

    const cancelAll = () => {
        setFormValues({
            transaction_id: "",
            customer_id: "",
            amount: "",
            status: "",
            payment_method: "",
            currency: ""
        });
        setI(0);
    };

    const submitData = () => {
        const { transaction_id, customer_id, amount, status, payment_method, currency } = formValues;
        const transaction_date = new Date().toISOString();
        const logged_by = JSON.parse(localStorage.getItem('user'));

        Axios.put(`http://localhost:3001/transactions/${transaction_id}`, {
            transaction_id: parseInt(transaction_id),
            customer_id,
            transaction_date,
            amount: parseFloat(amount),
            status,
            payment_method,
            currency,
            logged_by
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            alert("Transaction Updated Successfully");
            setI(0);
        })
        .catch(error => {
            alert("Wrong inputs, please check again");
            setI(0);
        });

        cancelAll();
    };

    useEffect(() => {
        if (promptShown.current) return;
        promptShown.current = true;

        const transaction_id = prompt("Enter Transaction ID (Only Integers Allowed)");
        if (!transaction_id || isNaN(transaction_id)) {
            alert("Enter correct data format");
            setI(0);
            return;
        }

        Axios.get(`http://localhost:3001/transactions/${transaction_id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            if (response.status === 200) {
                setTransaction(response.data);
                setFormValues({
                    transaction_id: response.data[0].transaction_id,
                    customer_id: response.data[0].customer_id,
                    amount: response.data[0].amount,
                    status: response.data[0].status,
                    payment_method: response.data[0].payment_method,
                    currency: response.data[0].currency
                });
            } else {
                alert("Transaction not found");
                setI(0);
            }
        })
        .catch(error => {
            console.log("Error fetching transaction:", error);
            alert("Transaction not found");
            setI(0);
        });
    }, [setI, token]);

    const InputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    if (!transaction) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className="forms" id="forms">
                <div>
                    Transaction ID:
                    <input type="text" name="transaction_id" value={formValues.transaction_id} disabled /><br />
                    Customer ID:
                    <input type="text" name="customer_id" value={formValues.customer_id} onChange={InputChange} /><br />
                    Transaction Amount:
                    <input type="text" name="amount" value={formValues.amount} onChange={InputChange} /><br />
                    Transaction Status:
                    <input type="radio" name="status" value="SUCCESSFUL" checked={formValues.status === "SUCCESSFUL"} onChange={InputChange} />SUCCESSFUL
                    <input type="radio" name="status" value="PENDING" checked={formValues.status === "PENDING"} onChange={InputChange} />PENDING
                    <input type="radio" name="status" value="FAILED" checked={formValues.status === "FAILED"} onChange={InputChange} />FAILED<br />
                    Transaction Type:
                    <input type="radio" name="payment_method" value="CREDIT" checked={formValues.payment_method === "CREDIT"} onChange={InputChange} />CREDIT
                    <input type="radio" name="payment_method" value="DEBIT" checked={formValues.payment_method === "DEBIT"} onChange={InputChange} />DEBIT
                    <input type="radio" name="payment_method" value="CASH" checked={formValues.payment_method === "CASH"} onChange={InputChange} />CASH<br />
                    Currency:
                    <input type="text" name="currency" value={formValues.currency} onChange={InputChange} /><br />
                </div>
                <div className="confirms">
                    <button className="CancelButton" id="ConfirmsButton" onClick={cancelAll}>CANCEL</button>
                    <button className="ConfirmButton" id="ConfirmsButton" onClick={submitData}>CONFIRM</button>
                </div>
            </div>
        </>
    );
}

export default UpdateForm;
