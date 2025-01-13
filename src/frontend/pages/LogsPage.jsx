import React, { useState, useEffect } from "react";
import { getLogs } from "../services/logsService"; // Import serwisu do pobierania logów
import "../styles/logsPage.css"; // Import styli

const LogsPage = () => {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // 🔹 Aktualna strona
    const itemsPerPage = 10; // 🔹 Liczba logów na stronę

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        const data = await getLogs();
        setLogs(data);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentLogs = logs.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage((prev) => Math.min(prev + 1, Math.ceil(logs.length / itemsPerPage)));
    const prevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

    return (
        <div className="logs-container">
            <h1 className="logs-title">📑 Logi logowań</h1>

            <table className="logs-table">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Email użytkownika</th>
                    <th>Data logowania</th>
                </tr>
                </thead>
                <tbody>
                {currentLogs.length > 0 ? (
                    currentLogs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.email}</td>
                            <td>{new Date(log.login_time).toLocaleString()}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3">Brak logów</td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className="pagination">
                <button onClick={prevPage} disabled={currentPage === 1}>Poprzednia</button>
                <span>Strona {currentPage} z {Math.ceil(logs.length / itemsPerPage)}</span>
                <button onClick={nextPage} disabled={currentPage === Math.ceil(logs.length / itemsPerPage)}>Następna</button>
            </div>
        </div>
    );
};

export default LogsPage;
