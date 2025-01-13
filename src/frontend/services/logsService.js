const API_URL = "http://localhost:3001";

export const getLogs = async () => {
    try {
        const response = await fetch(`${API_URL}/logs`, {
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) throw new Error("Błąd pobierania logów!");

        return await response.json();
    } catch (error) {
        console.error("⛔ Błąd:", error);
        return { error: "Nie udało się pobrać logów!" };
    }
};
