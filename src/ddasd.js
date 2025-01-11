export const getOrderById = async (orderId) => {
    try {
        const response = await fetch(`http://localhost:3001/orders/${orderId}`);
        if (!response.ok) throw new Error("Błąd pobierania szczegółów zamówienia");

        const data = await response.json();
        console.log("✅ Otrzymane szczegóły zamówienia:", data);

        // 🔹 Upewniamy się, że `data` zawiera poprawne zamówienie
        if (!data || Object.keys(data).length === 0) {
            console.warn("⚠️ API zwróciło pusty obiekt lub null!");
            return null;
        }

        return data;
    } catch (error) {
        console.error("⛔ Błąd pobierania szczegółów zamówienia:", error);
        return null;
    }
};