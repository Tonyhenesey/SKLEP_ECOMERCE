import React, { useEffect, useState } from "react";
import { getStock } from "../services/stockService";
import AddProductForm from "../components/AddProductForm";
import "../styles/stockPage.css"; // 🔹 Nowe style

const StockPage = () => {
    const [stock, setStock] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const refreshStock = () => {
        getStock().then(data => setStock(data));
    };

    useEffect(() => {
        refreshStock();
    }, []);

    const filteredStock = stock.filter(item =>
        item.product.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentStock = filteredStock.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredStock.length / itemsPerPage)));
    const prevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="stock-container">
            <h1>📊 Stan Magazynowy</h1>
            <AddProductForm refreshStock={refreshStock} />


            <div className="search-bar-container">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 Wyszukaj produkt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="search-button" onClick={() => setCurrentPage(1)}>Szukaj</button>
            </div>


            <div className="stock-table-container">
                <table className="stock-table">
                    <thead>
                    <tr>
                        <th>📦 Produkt</th>
                        <th>💰 Cena</th>
                        <th>📊 Ilość</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentStock.length > 0 ? (
                        currentStock.map((item) => (
                            <tr key={item.id}>
                                <td>{item.product}</td>
                                <td>{item.price} PLN</td>
                                <td>{item.quantity}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="no-results">🚫 Brak wyników</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>


            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button">
                    ◀ Poprzednia
                </button>
                <span className="pagination-info">
                    Strona {currentPage} z {Math.ceil(filteredStock.length / itemsPerPage)}
                </span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(filteredStock.length / itemsPerPage)} className="pagination-button">
                    Następna ▶
                </button>
            </div>
        </div>
    );
};

export default StockPage;
