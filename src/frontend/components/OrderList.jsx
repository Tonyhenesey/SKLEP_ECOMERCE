import React, { useState, useEffect } from "react";
import OrderForm from "./OrderForm";
import OrderDetails from "./OrderDetails";
import { getOrders } from "../services/orderService";
import "../styles/orderList.css";  // 🔹 Import nowego CSS

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const itemsPerPage = 5;

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = () => {
        getOrders().then(data => setOrders(data));
    };


    const filteredOrders = orders.filter(order =>
        order.id.toString().includes(searchTerm) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerSurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.status.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredOrders.length / itemsPerPage)));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="order-list-container">
            <h2>📦 Lista Zamówień</h2>
            <OrderForm refreshOrders={fetchOrders} />


            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 Wyszukaj zamówienie..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button" onClick={() => setCurrentPage(1)}>Szukaj</button>
            </div>

            <ul className="order-list">
                {currentOrders.map(order => (
                    <li
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        className="order-item"
                    >
                        <span className="order-id">#{order.id}</span>
                        <span className="order-name">{order.customerName} {order.customerSurname}</span>
                        <span className="order-status">{order.status}</span>
                        <span className="order-address">{order.address}</span>
                    </li>
                ))}
            </ul>

            {selectedOrderId && <OrderDetails orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />}

            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button">
                    ◀ Poprzednia
                </button>
                <span className="pagination-info">
                    Strona {currentPage} z {Math.ceil(filteredOrders.length / itemsPerPage)}
                </span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)} className="pagination-button">
                    Następna ▶
                </button>
            </div>
        </div>
    );
};

export default OrderList;
