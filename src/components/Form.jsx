import React from "react";
import Axios from "axios";
import '../pages/User.css';
import {useNavigate} from "react-router-dom";
function Form({setI}) {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    if (!token) {
        navigate('/login');
    }
    const cancelAll = () => {
        document.getElementById("TransactionID").value = "";
        document.getElementById("CustomerID").value = "";
        document.getElementById("Amount").value = "";
        document.getElementById("Currency").value = "";
        document.getElementById("TransactionStatus").checked = false;
        document.getElementById("TransactionType").checked = false;
        setI(0);
    }

    const submitData = () => {
        var flag = 0;
        var transaction_id = document.getElementById("TransactionID").value;
        if (parseInt(transaction_id) != transaction_id) {
            alert("Enter correct data format");
            flag = 1;
        }
        const token = JSON.parse(localStorage.getItem('token'));

        if (flag === 0) {
            var customer_id = document.getElementById("CustomerID").value;
            var transaction_date = new Date().toISOString();
            var amount = parseFloat(document.getElementById("Amount").value);
            var status = document.querySelector('input[name="TransactionStatus"]:checked').value;
            var payment_method = document.querySelector('input[name="TransactionType"]:checked').value;
            var currency = document.getElementById("Currency").value;
            var logged_by = JSON.parse(localStorage.getItem('user'));

            Axios.post('http://localhost:3001/transactions', {
                transaction_id: parseInt(transaction_id),
                customer_id: customer_id,
                transaction_date: transaction_date,
                amount: amount,
                status: status,
                payment_method: payment_method,
                currency: currency,
                logged_by: logged_by
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                alert("Transaction Created Successfully");
                setI(0);
            })
            .catch(error => {
                alert("Wrong inputs, please check again");
                setI(0);
            });
        }
        cancelAll();
    }
    

    return (
        <>
            <div className="forms" id="forms">
                TransactionID:
                <input type="text" placeholder="Enter Transaction ID" id="TransactionID" /> <br />
                CustomerID:
                <input type="text" placeholder="Enter CustomerID" id="CustomerID" /><br />
                Transaction Amount:
                <input type="text" placeholder="Amount" id="Amount" /><br />
                Transaction Status:
                <input type="radio" name="TransactionStatus" id="TransactionStatus" value="SUCCESSFUL" />SUCCESSFUL
                <input type="radio" name="TransactionStatus" id="TransactionStatus" value="PENDING" />PENDING
                <input type="radio" name="TransactionStatus" id="TransactionStatus" value="FAILED" />FAILED <br />
                Transaction Type:
                <input type="radio" name="TransactionType" id="TransactionType" value="CREDIT" />CREDIT
                <input type="radio" name="TransactionType" id="TransactionType" value="DEBIT" />DEBIT
                <input type="radio" name="TransactionType" id="TransactionType" value="CASH" />CASH <br />
                Currency:
                <input type="text" placeholder="Enter Currency Type" id="Currency" /> <br />
                <div className="confirms">
                    <button className="CancelButton" id="ConfirmsButton" onClick={cancelAll}>CANCEL</button>
                    <button className="ConfirmButton" id="ConfirmsButton" onClick={submitData}>CONFIRM</button>
                </div>
            </div>
        </>
    );
}

export default Form;