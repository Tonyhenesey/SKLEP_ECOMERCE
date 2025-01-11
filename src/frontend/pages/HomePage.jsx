import React from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    return (
        <div>
            <h1>🏠 Strona Główna</h1>
            <nav>
                <Link to="/orders">📦 Zamówienia</Link> |
                <Link to="/customers">👥 Klienci</Link> |
                <Link to="/stock">🏪 Magazyn</Link>
                {user?.role === "admin" && (
                    <> | <Link to="/logs">📜 Logi logowań</Link></>
                )}
            </nav>
            <button onClick={handleLogout}>🚪 Wyloguj</button>
        </div>
    );
};

export default HomePage;
