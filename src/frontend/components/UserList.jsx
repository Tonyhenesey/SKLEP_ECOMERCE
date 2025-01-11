import React, { useState, useEffect } from "react";

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("token");

        fetch("http://localhost:3001/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => setUsers(data))
            .catch(error => console.error("Błąd pobierania użytkowników:", error));
    }, []);

    return (
        <div>
            <h2>👤 Lista użytkowników</h2>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name} ({user.role})</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
