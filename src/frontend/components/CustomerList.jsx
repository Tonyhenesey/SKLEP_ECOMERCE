import React, { useState, useEffect } from "react";
import { getCustomers } from "../services/customerService";
import CustomerForm from "./CustomerForm"; // ✅ Import formularza
import CustomerDetails from "./CustomerDetails"; // ✅ Import szczegółów klienta

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [error, setError] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState(null); // ✅ Śledzimy wybranego klienta

    const fetchCustomers = async () => {
        try {
            const data = await getCustomers();
            if (data.error) {
                setError(data.error);
            } else {
                setCustomers(data);
                setError("");
            }
        } catch (err) {
            setError("❌ Nie udało się pobrać klientów!");
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    return (
        <div>
            <h2>👥 Lista Klientów</h2>

            {/* Formularz do dodawania klientów */}
            <CustomerForm onCustomerAdded={fetchCustomers} />

            {selectedCustomer ? (
                // ✅ Jeśli klient jest wybrany, pokazujemy jego szczegóły zamiast listy
                <CustomerDetails customerId={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
            ) : (
                <>
                    {error && <p style={{ color: "red" }}>❌ {error}</p>}
                    <ul>
                        {customers.map((customer) => (
                            <li key={customer.id}
                                onClick={() => setSelectedCustomer(customer.id)}
                                style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
                                {customer.name} {customer.surname} - {customer.email}
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default CustomerList;
