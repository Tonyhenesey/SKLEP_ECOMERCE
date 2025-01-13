import React, { useState, useEffect } from "react";
import { getCustomers } from "../services/customerService";
import CustomerForm from "./CustomerForm";
import CustomerDetails from "./CustomerDetails";
import "../styles/customerList.css";  // 🔹 Nowy styl

const CustomerList = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        const data = await getCustomers();
        setCustomers(data);
    };


    const filteredCustomers = customers.filter(customer =>
        customer.id.toString().includes(searchTerm) ||
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredCustomers.length / itemsPerPage)));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="customer-list-container">
            <h2>👥 Lista Klientów</h2>
            <CustomerForm onCustomerAdded={fetchCustomers} />


            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 Wyszukaj klienta..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button" onClick={() => setCurrentPage(1)}>Szukaj</button>
            </div>

            {selectedCustomer ? (
                <CustomerDetails customerId={selectedCustomer} onClose={() => setSelectedCustomer(null)} />
            ) : (
                <ul className="customer-list">
                    {currentCustomers.map(customer => (
                        <li
                            key={customer.id}
                            onClick={() => setSelectedCustomer(customer.id)}
                            className="customer-item"
                        >
                            <span className="customer-id">#{customer.id}</span>
                            <span className="customer-name">{customer.name} {customer.surname}</span>
                            <span className="customer-email">{customer.email}</span>
                        </li>
                    ))}
                </ul>
            )}


            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button">
                    ◀ Poprzednia
                </button>
                <span className="pagination-info">
                    Strona {currentPage} z {Math.ceil(filteredCustomers.length / itemsPerPage)}
                </span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredCustomers.length / itemsPerPage)} className="pagination-button">
                    Następna ▶
                </button>
            </div>
        </div>
    );
};

export default CustomerList;
