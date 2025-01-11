import React, { useEffect, useState } from "react";

const LogsPage = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3001/logs", {
            headers: { "Authorization": "admin" },
        })
            .then(res => res.json())
            .then(data => setLogs(data));
    }, []);

    return (
        <div>
            <h2>📜 Logi logowań</h2>
            <ul>
                {logs.map(log => (
                    <li key={log.id}>{log.username} - {log.login_time}</li>
                ))}
            </ul>
        </div>
    );
};

export default LogsPage;
