import React, { useState, useEffect } from "react";
import { getOrderById, updateOrder, cancelOrder } from "../services/orderService";
import styles from "../styles/orderDetails.module.css";

const OrderDetails = ({ orderId, onClose }) => {
    const [order, setOrder] = useState(null);
    const [newAddress, setNewAddress] = useState("");
    const [loading, setLoading] = useState(true);  // Stan ładowania

    useEffect(() => {
        if (orderId) {
            setLoading(true);  // Ustawiamy ładowanie na true
            getOrderById(orderId).then(data => {
                console.log("📜 Szczegóły zamówienia:", data);
                setOrder(data);
                setLoading(false);  // Po pobraniu danych wyłączamy ładowanie
            }).catch(error => {
                console.error("⛔ Błąd pobierania zamówienia:", error);
                setLoading(false);
            });
        }
    }, [orderId]);

    if (loading) {
        return <p>⏳ Ładowanie szczegółów zamówienia...</p>;
    }

    if (!order) {
        return <p>⚠️ Zamówienie nie znalezione!</p>;
    }

    const handleChangeAddress = async () => {
        if (newAddress.trim() === "") {
            alert("❌ Adres nie może być pusty!");
            return;
        }

        const result = await updateOrder(order.id, newAddress);

        if (!result.error) {
            setOrder(prev => ({ ...prev, address: newAddress }));
            alert("✅ Adres zaktualizowany!");
        } else {
            alert("❌ Błąd aktualizacji zamówienia!");
        }
    };

    const handleCancelOrder = () => {
        cancelOrder(order.id).then((response) => {
            if (!response.error) {
                setOrder(prev => ({ ...prev, status: "Anulowane" })); // Aktualizujemy status na froncie
            }
        });
    };


    return (
        <div className={styles.orderDetailsContainer}>
            <h2>Zamówienie: {order.id}</h2>
            <p><strong>📅 Data:</strong> {order.orderDate}</p>
            <p><strong>👤 Klient:</strong> {order.customerName} {order.customerSurname}</p>
            <p><strong>📍 Adres dostawy:</strong> {order.address}</p>
            <p><strong>📌 Status:</strong> {order.status}</p>

            <h3>🛒 Produkty:</h3>
            {order.products.length > 0 ? (
                <ul>
                    {order.products.map((product, index) => (
                        <li key={index}>
                            {product.name} - {product.quantity} szt. ({product.price} PLN/szt.)
                        </li>
                    ))}
                </ul>
            ) : (
                <p>🚨 Brak produktów w tym zamówieniu.</p>
            )}

            <h3>🔄 Zmień adres dostawy:</h3>
            <input
                type="text"
                placeholder="Nowy adres"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
            />
            <button onClick={handleChangeAddress}>✅ Zmień adres</button>

            <br/>
            <button onClick={handleCancelOrder} style={{ color: "red" }}>❌ Anuluj zamówienie</button>
            <button onClick={onClose} style={{ marginLeft: "10px" }}>❌ Zamknij</button>
        </div>
    );
};

export default OrderDetails;
