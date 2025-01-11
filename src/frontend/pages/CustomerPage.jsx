import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerById } from "../services/customerService";
import "../styles/customerPage.css";

const CustomerPage = () => {
    const { id } = useParams();  // Pobranie ID z URL
    const [customer, setCustomer] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Pobrane ID z URL:", id); // Debugowanie
        const fetchCustomer = async () => {
            const data = await getCustomerById(id);
            if (!data) {
                alert("Nie znaleziono klienta!");
                navigate("/customer");
            } else {
                setCustomer(data);
            }
        };
        fetchCustomer();
    }, [id, navigate]);

    if (!customer) return <p>Ładowanie danych klienta...</p>;

    return (
        <div className="customer-page-container">
            <h2>Profil Klienta</h2>
            <div className="customer-card">
                <h3>{customer.name} {customer.surname}</h3>
                <p>📧 Email: {customer.email}</p>
                <p>📞 Telefon: {customer.phone}</p>
                <p>📅 Data urodzenia: {customer.birthDate}</p>
                <p>🏠 Adres: {customer.address}</p>
            </div>
            <button onClick={() => navigate("/customer")}>🔙 Powrót</button>
        </div>
    );
};

export default CustomerPage;
