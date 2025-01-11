import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();  // 👈 Dodajemy hook do nawigacji

    const handleLogin = () => {
        fetch("http://localhost:3001/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.user) {
                    localStorage.setItem("role", data.user.role);
                    localStorage.setItem("token", data.token);  // Zapamiętanie tokena
                    document.cookie = "session=active";

                    // 🔄 **Przekierowanie zależnie od roli**
                    if (data.user.role === "admin") {
                        navigate("/users");  // Admin -> zarządzanie użytkownikami
                    } else {
                        navigate("/customers");  // Klient -> lista klientów
                    }
                } else {
                    setError("❌ Nieprawidłowy email lub hasło!");
                }
            })
            .catch(() => setError("⚠️ Błąd połączenia z serwerem!"));
    };

    return (
        <div>
            <h2>🔑 Logowanie</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Zaloguj</button>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default Login;
