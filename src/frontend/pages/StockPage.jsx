import React, { useEffect, useState } from "react";
import { getStock } from "../services/stockService";
import AddProductForm from "../components/AddProductForm";

const StockPage = () => {
    const [stock, setStock] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // 🔍 Stan dla pola wyszukiwania

    const refreshStock = () => {
        getStock().then(data => setStock(data));
    };

    useEffect(() => {
        refreshStock();
    }, []);

    // 🔍 Filtrujemy produkty na podstawie wyszukiwania
    const filteredStock = stock.filter(item =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1>📊 Stan magazynowy</h1>
            <AddProductForm refreshStock={refreshStock} />

            {/* 🔍 Pole wyszukiwania */}
            <input
                type="text"
                placeholder="🔍 Wyszukaj produkt..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ marginBottom: "10px", padding: "5px", width: "100%" }}
            />

            <table border="1">
                <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Cena</th>
                    <th>Ilość</th>
                </tr>
                </thead>
                <tbody>
                {filteredStock.length > 0 ? (
                    filteredStock.map((item) => (
                        <tr key={item.id}>
                            <td>{item.product}</td>
                            <td>{item.price} PLN</td>
                            <td>{item.quantity}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" style={{ textAlign: "center" }}>🚫 Brak wyników</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default StockPage;
