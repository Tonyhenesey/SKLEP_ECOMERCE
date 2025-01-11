import React, { useState, useEffect } from "react";

const Logs = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/logs", {
            method: "GET",
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => setLogs(data))
            .catch(error => console.error("Błąd pobierania logów:", error));
    }, []);

    return (
        <div>
            <h2>📜 Logi logowań</h2>
            <ul>
                {logs.map((log, index) => (
                    <li key={index}>{log.date} - {log.name} ({log.email})</li>
                ))}
            </ul>
        </div>
    );
};

export default Logs;
