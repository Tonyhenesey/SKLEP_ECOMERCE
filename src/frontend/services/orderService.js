const API_URL = "http://localhost:3001";

export const getOrders = async () => {
    try {
        const response = await fetch(`${API_URL}/orders`);
        if (!response.ok) throw new Error("Błąd pobierania zamówień!");
        return await response.json();
    } catch (error) {
        console.error("⛔ Błąd:", error);
        return { error: "Nie udało się pobrać zamówień!" };
    }
};

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


export const updateOrder = async (orderId, address) => {
    try {
        const response = await fetch(`${API_URL}/orders/${orderId}/address`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address }),  // 🔹 Wysyłamy tylko `address`
        });

        if (!response.ok) {
            throw new Error(`Błąd serwera: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("⛔ Błąd aktualizacji zamówienia:", error);
        return { error: "Nie udało się zaktualizować zamówienia" };
    }
};


export const cancelOrder = async (orderId) => {
    try {
        console.log("📤 Wysyłanie żądania anulowania zamówienia:", orderId);

        const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();
        console.log("✅ Odpowiedź serwera:", data);

        return data;
    } catch (error) {
        console.error("⛔ Błąd anulowania zamówienia:", error);
        return { error: "Nie udało się anulować zamówienia" };
    }
};
export const createOrder = async (customerId, address, status, products) => {
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ customerId, address, status, products }),
        });

        return await response.json();
    } catch (error) {
        console.error("⛔ Błąd dodawania zamówienia:", error);
        return { error: "Nie udało się dodać zamówienia" };
    }
};
