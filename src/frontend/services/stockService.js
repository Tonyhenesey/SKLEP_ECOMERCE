const API_URL = "http://localhost:3001";

export const getStock = async () => {
    try {
        const response = await fetch(`${API_URL}/stock`);
        if (!response.ok) throw new Error("Błąd pobierania danych magazynowych");

        const data = await response.json();
        console.log("✅ Dane magazynowe z API:", data);
        return data;
    } catch (error) {
        console.error("⛔ Błąd:", error);
        return [];
    }
};

export const addProduct = async (name, price, stock) => {
    try {
        const response = await fetch(`${API_URL}/stock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, price, stock }),
        });

        if (!response.ok) throw new Error("Błąd dodawania produktu");

        const data = await response.json();
        console.log("✅ Produkt dodany:", data);
        return data;
    } catch (error) {
        console.error("⛔ Błąd dodawania produktu:", error);
        return { error: "Nie udało się dodać produktu" };
    }
};
export const getStockById = async (productId) => {
    try {
        const response = await fetch(`http://localhost:3001/stock/${productId}`);
        if (!response.ok) throw new Error("Błąd pobierania produktu!");

        return await response.json();
    } catch (error) {
        console.error("⛔ Błąd pobierania produktu:", error);
        return { error: "Nie udało się pobrać produktu!" };
    }
};

