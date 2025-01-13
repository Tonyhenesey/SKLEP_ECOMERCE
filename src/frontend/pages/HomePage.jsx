import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/homePage.css"; // Import CSS

const HomePage = ({ user }) => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1 className="home-title">🏠 Strona Główna</h1>
            <p className="welcome-message">
                Witaj! Wybierz jedną z poniższych sekcji, aby zarządzać aplikacją.
            </p>
            <nav className="home-nav">
                <button className="home-nav-button" onClick={() => navigate("/customers")}>👥 Klienci</button>
                <button className="home-nav-button" onClick={() => navigate("/orders")}>📦 Zamówienia</button>
                <button className="home-nav-button" onClick={() => navigate("/stock")}>🏬 Magazyn</button>
                {user?.role === "admin" && (
                    <button className="home-nav-button admin-button" onClick={() => navigate("/logs")}>
                        📑 Logi
                    </button>
                )}
            </nav>
        </div>
    );
};

export default HomePage;
