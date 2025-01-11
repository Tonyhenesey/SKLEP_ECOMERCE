import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setUser }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (data.error) {
                setError(data.error);
                return;
            }

            // Ustawienie użytkownika
            setUser(data.user);
            window.location.reload()
            localStorage.setItem("user", JSON.stringify(data.user)); // Opcjonalne zapamiętanie sesji
        } catch (error) {
            setError("Błąd serwera! Spróbuj ponownie.");
        }
    };

    // 🔹 Automatyczne przekierowanie po zalogowaniu
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user")); // Sprawdzanie sesji
        if (storedUser) {
            setUser(storedUser);
            navigate("/home");
        }
    }, [setUser, navigate]);

    return (
        <div>
            <h2>🔐 Logowanie</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Zaloguj się</button>
            </form>
        </div>
    );
};

export default LoginPage;
