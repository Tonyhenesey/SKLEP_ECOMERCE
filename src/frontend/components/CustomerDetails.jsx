import React, { useState, useEffect } from "react";
import { getCustomerById, updateCustomer } from "../services/customerService";
import "../styles/customerDetails.css";

const CustomerDetails = ({ customerId, onClose }) => {
    const [customer, setCustomer] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        getCustomerById(customerId).then((data) => {
            if (data.error) setError(data.error);
            else setCustomer(data);
        });
    }, [customerId]);

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const response = await updateCustomer(customerId, customer);
        if (response.error) {
            setError(response.error);
        } else {
            setMessage("✅ Dane klienta zaktualizowane!");
        }
    };

    if (!customer) return <p>⏳ Ładowanie danych klienta...</p>;

    return (
        <div className="customer-details-container">
            <h2>👤 Szczegóły Klienta</h2>
            {error && <p className="error-message">❌ {error}</p>}
            {message && <p className="success-message">{message}</p>}

            <form onSubmit={handleUpdate}>
                <input type="text" name="name" value={customer.name} onChange={handleChange} required />
                <input type="text" name="surname" value={customer.surname} onChange={handleChange} required />
                <input type="text" name="phone" value={customer.phone} onChange={handleChange} required />
                <input type="email" name="email" value={customer.email} onChange={handleChange} required />
                <input type="date" name="birthDate" value={customer.birthDate} onChange={handleChange} required />
                <input type="text" name="address" value={customer.address} onChange={handleChange} required />
                <button type="submit" className="update-button">💾 Zapisz zmiany</button>
            </form>

            <button onClick={onClose} className="back-button">🔙 Powrót do listy</button>
        </div>
    );
};

export default CustomerDetails;
