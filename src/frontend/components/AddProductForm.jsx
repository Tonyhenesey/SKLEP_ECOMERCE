import React, { useState } from "react";
import { addProduct } from "../services/stockService";

const AddProductForm = ({ refreshStock }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !price || !stock) {
            alert("❌ Uzupełnij wszystkie pola!");
            return;
        }

        const result = await addProduct(name, parseFloat(price), parseInt(stock, 10));

        if (result.error) {
            alert("⛔ Wystąpił błąd: " + result.error);
        } else {
            alert("✅ Produkt dodany!");
            refreshStock();
            setName("");
            setPrice("");
            setStock("");
        }
    };

    return (
        <div>
            <h2>➕ Dodaj nowy produkt</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Nazwa produktu" value={name} onChange={(e) => setName(e.target.value)} required />
                <input type="number" placeholder="Cena (PLN)" value={price} onChange={(e) => setPrice(e.target.value)} required />
                <input type="number" placeholder="Ilość" value={stock} onChange={(e) => setStock(e.target.value)} required />
                <button type="submit">Dodaj produkt</button>
            </form>
        </div>
    );
};

export default AddProductForm;
