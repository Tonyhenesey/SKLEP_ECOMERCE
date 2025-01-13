import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/loginPage.css";

const LoginPage = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();


    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:3001/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
           const userID=data.user.id;
           const role=data.user.role;

            const logsResponse = await fetch("http://localhost:3001/logs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role }),
            });
            // console.log("UserID:", userID);
            // console.log("Role:", role);
            console.log(logsResponse);
            if (data.error) {
                setError(data.error);
                return;
            }

            setUser(data.user);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home");
        } catch (error) {
            setError("Błąd serwera! Spróbuj ponownie.");
        }
    };

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (storedUser) {
            setUser(storedUser);
            navigate("/home");
        }
    }, [setUser, navigate]);

    return (
        <div className="login-container">
            <h2>🔐 Logowanie</h2>
            {error && <p style={{color: "red"}}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
