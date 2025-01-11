import React, { useState } from "react";
import { createOrder } from "../services/orderService";

const OrderForm = ({ refreshOrders }) => {
    const [customerId, setCustomerId] = useState("");
    const [address, setAddress] = useState("");
    const [status, setStatus] = useState("Nowe");
    const [message, setMessage] = useState("");
    const [products, setProducts] = useState([]);

    const addProduct = () => {
        setProducts([...products, { productId: "", quantity: "" }]);
    };

    const handleProductChange = (index, field, value) => {
        const newProducts = [...products];
        newProducts[index][field] = value;
        setProducts(newProducts);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (products.length === 0) {
            setMessage("❌ Musisz dodać co najmniej jeden produkt!");
            return;
        }

        const newOrder = { customerId, address, status, products };

        try {
            const response = await createOrder(customerId, address, status, products);
            if (response.error) {
                setMessage(`❌ Błąd: ${response.error}`);
            } else {
                setMessage("✅ Zamówienie dodane!");
                setCustomerId("");
                setAddress("");
                setStatus("Nowe");
                setProducts([]);
                refreshOrders(); // 🔄 Odśwież listę zamówień
            }
        } catch (error) {
            setMessage("❌ Błąd serwera!");
        }
    };

    return (
        <div>
            <h3>➕ Dodaj Zamówienie</h3>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    placeholder="ID Klienta"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Adres dostawy"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />

                <h4>🛒 Produkty</h4>
                {products.map((product, index) => (
                    <div key={index}>
                        <input
                            type="number"
                            placeholder="ID produktu"
                            value={product.productId}
                            onChange={(e) => handleProductChange(index, "productId", e.target.value)}
                            required
                        />
                        <input
                            type="number"
                            placeholder="Ilość"
                            value={product.quantity}
                            onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                            required
                        />
                    </div>
                ))}
                <button type="button" onClick={addProduct}>➕ Dodaj produkt</button>

                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Nowe">Nowe</option>
                    <option value="W realizacji">W realizacji</option>
                    <option value="Zrealizowane">Zrealizowane</option>
                </select>
                <button type="submit">➕ Dodaj zamówienie</button>
            </form>
        </div>
    );
};

export default OrderForm;
