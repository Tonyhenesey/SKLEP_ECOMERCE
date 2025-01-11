import React, { useState } from "react";
import { createCustomer } from "../services/customerService";

const CustomerForm = ({ onCustomerAdded }) => {
    const [customer, setCustomer] = useState({
        name: "",
        surname: "",
        phone: "",
        email: "",
        birthDate: "",
        address: "",
    });

    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await createCustomer(customer);
        if (response.customerId) {
            alert("✅ Klient dodany!");
            setCustomer({ name: "", surname: "", phone: "", email: "", birthDate: "", address: "" });
            onCustomerAdded(); // Odświeżenie listy klientów
        } else {
            alert("❌ Błąd podczas dodawania klienta!");
        }
    };

    return (
        <div className="customer-form-container">
            <h2>➕ Dodaj Nowego Klienta</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Imię" value={customer.name} onChange={handleChange} required />
                <input type="text" name="surname" placeholder="Nazwisko" value={customer.surname} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Telefon" value={customer.phone} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={customer.email} onChange={handleChange} required />
                <input type="date" name="birthDate" value={customer.birthDate} onChange={handleChange} required />
                <input type="text" name="address" placeholder="Adres" value={customer.address} onChange={handleChange} required />
                <button type="submit">✔️ Dodaj Klienta</button>
            </form>
        </div>
    );
};

export default CustomerForm;
