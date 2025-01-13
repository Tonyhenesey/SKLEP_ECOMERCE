import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import CustomerList from "./frontend/components/CustomerList";
import OrderList from "./frontend/components/OrderList";
import CustomerDetails from "./frontend/components/CustomerDetails";
import StockPage from "./frontend/pages/StockPage";
import LoginPage from "./frontend/pages/LoginPage";
import HomePage from "./frontend/pages/HomePage";

import "./frontend/styles/nav.css";
import LogsPage from "./frontend/pages/LogsPage";

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    return (
        <Router>
            <nav className="navbar">
                {user && <Link to="/">🏠 Strona główna</Link>}
                {user && <Link to="/customers">👥 Klienci</Link>}
                {user && <Link to="/orders">📦 Zamówienia</Link>}
                {user && <Link to="/stock">🏬 Magazyn</Link>}
                {user?.role === "admin" && (
                    <Link to="/logs">📜 Logi</Link>

                )}
                {user && <button onClick={handleLogout}>🚪 Wyloguj</button>}
            </nav>

            <Routes>
                <Route path="/" element={user ? <Navigate to="/home" /> : <LoginPage setUser={setUser} />} />
                <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/" />} />
                <Route path="/customers" element={user ? <CustomerList /> : <Navigate to="/" />} />
                <Route path="/customers/:id" element={user ? <CustomerDetails /> : <Navigate to="/" />} />
                <Route path="/orders" element={user ? <OrderList /> : <Navigate to="/" />} />
                <Route path="/stock" element={user ? <StockPage /> : <Navigate to="/" />} />=
                <Route path="/logs" element={user ? <LogsPage /> : <Navigate to="/"/>}/>
            </Routes>
        </Router>
    );
};

export default App;
