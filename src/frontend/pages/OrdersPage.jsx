import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, cancelOrder } from "../services/orderService";
import "../styles/ordersPage.css";

const OrdersPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrder = async () => {
            const data = await getOrderById(id);
            if (!data) {
                alert("Nie znaleziono zamówienia!");
                navigate("/");
            } else {
                setOrder(data);
            }
        };
        fetchOrder();
    }, [id, navigate]);

    const handleCancelOrder = () => {
        cancelOrder(order.id);
        alert("Zamówienie anulowane!");
        navigate("/");
    };

    if (!order) return <p>Ładowanie zamówienia...</p>;

    return (
        <div className="order-page-container">
            <h2>Szczegóły Zamówienia</h2>
            <div className="order-card">
                <p><strong>ID:</strong> {order.id}</p>
                <p><strong>Adres dostawy:</strong> {order.address}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <h3>Produkty:</h3>
                <ul className="product-list">
                    {order.products.map((product) => (
                        <li key={product}>{product}</li>
                    ))}
                </ul>
                <button onClick={handleCancelOrder} className="cancel-button">❌ Anuluj Zamówienie</button>
                <button onClick={() => navigate("/")} className="back-button">🔙 Powrót</button>
            </div>
        </div>
    );
};

export default OrdersPage;
