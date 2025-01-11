import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import CustomerList from "./frontend/components/CustomerList";
import OrderList from "./frontend/components/OrderList";
import CustomerDetails from "./frontend/components/CustomerDetails";
import LogsPage from "./frontend/pages/LogsPage";
import StockPage from "./frontend/pages/StockPage";
import LoginPage from "./frontend/pages/LoginPage";
import HomePage from "./frontend/pages/HomePage";

import "./frontend/styles/nav.css";

const App = () => {
    const [user, setUser] = useState(null); // 🔹 Stan użytkownika

    return (
        <Router>
            {/* 🔹 Nawigacja */}
            <nav className="navbar">
                <Link to="/">🏠 Strona główna</Link>
                <Link to="/customers">👥 Klienci</Link>
                <Link to="/orders">📦 Zamówienia</Link>
                <Link to="/stock">🏬 Magazyn</Link>
                {user?.role === "admin" && <Link to="/logs">📜 Logi logowań</Link>}
            </nav>

            {/* 🔹 Definicja ścieżek */}
            <Routes>
                <Route path="/" element={<LoginPage setUser={setUser} />} />
                <Route path="/home" element={user ? <HomePage user={user} /> : <Navigate to="/" />} />
                <Route path="/customers" element={user ? <CustomerList /> : <Navigate to="/" />} />
                <Route path="/customers/:id" element={user ? <CustomerDetails /> : <Navigate to="/" />} />
                <Route path="/orders" element={user ? <OrderList /> : <Navigate to="/" />} />
                <Route path="/stock" element={user ? <StockPage /> : <Navigate to="/" />} />
                <Route path="/logs" element={user?.role === "admin" ? <LogsPage /> : <Navigate to="/home" />} />
            </Routes>
        </Router>
    );
};

export default App;
