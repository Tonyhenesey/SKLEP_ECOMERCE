import React, { useEffect, useState } from "react";
import { getStock, getStockById } from "../services/stockService";

const ProductStock = () => {
    const [products, setProducts] = useState([]);
    const [searchId, setSearchId] = useState("");
    const [searchResult, setSearchResult] = useState(null);
    const [error, setError] = useState("");

    // Pobieranie pełnej listy produktów po załadowaniu komponentu
    useEffect(() => {
        getStock().then(data => setProducts(data));
    }, []);

    // Obsługa wyszukiwania produktu po ID
    const handleSearch = async () => {
        if (!searchId) {
            setError("❌ Wprowadź ID produktu!");
            return;
        }

        const result = await getStockById(searchId);
        if (result.error) {
            setError(result.error);
            setSearchResult(null);
        } else {
            setSearchResult(result);
            setError("");
        }
    };

    return (
        <div>
            <h2>📦 Lista produktów</h2>

            {/* Wyszukiwarka produktu po ID */}
            <div>
                <input
                    type="number"
                    placeholder="Wpisz ID produktu"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                />
                <button onClick={handleSearch}>🔍 Szukaj</button>
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Wynik wyszukiwania */}
            {searchResult && (
                <div>
                    <h3>🔍 Wynik wyszukiwania:</h3>
                    <p>📦 Produkt: {searchResult.product}</p>
                    <p>💰 Cena: {searchResult.price} PLN</p>
                    <p>📊 Ilość: {searchResult.quantity} szt.</p>
                </div>
            )}

            {/* Lista wszystkich produktów */}
            <table border="1">
                <thead>
                <tr>
                    <th>Produkt</th>
                    <th>Cena</th>
                </tr>
                </thead>
                <tbody>
                {products.map(product => (
                    <tr key={product.id}>
                        <td>{product.product}</td>
                        <td>{product.price} PLN</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductStock;
