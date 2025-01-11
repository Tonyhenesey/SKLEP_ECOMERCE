import React, { useState, useEffect } from "react";
import OrderForm from "./OrderForm";
import OrderDetails from "./OrderDetails";
import { getOrders } from "../services/orderService";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrderId, setSelectedOrderId] = useState(null);

    const fetchOrders = () => {
        getOrders().then(data => setOrders(data));
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div>
            <h2>📦 Lista Zamówień</h2>
            <OrderForm refreshOrders={fetchOrders} />

            <ul>
                {orders.map(order => (
                    <li
                        key={order.id}
                        onClick={() => setSelectedOrderId(order.id)}
                        style={{ cursor: "pointer", color: selectedOrderId === order.id ? "blue" : "black" }}
                    >
                        Zamówienie {order.id} - {order.customerName} {order.customerSurname} - {order.status} - {order.address}
                    </li>
                ))}
            </ul>

            {selectedOrderId && <OrderDetails orderId={selectedOrderId} onClose={() => setSelectedOrderId(null)} />}
        </div>
    );
};

export default OrderList;
