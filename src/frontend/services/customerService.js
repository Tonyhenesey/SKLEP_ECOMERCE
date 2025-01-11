export const getCustomers = async () => {
    try {
        const response = await fetch("http://localhost:3001/customers");
        return await response.json();
    } catch (error) {
        console.error("❌ Błąd pobierania klientów:", error);
        return { error: "Nie udało się pobrać klientów!" };
    }
};

export const createCustomer = async (customer) => {
    try {
        const response = await fetch("http://localhost:3001/customers", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(customer),
        });

        return await response.json();
    } catch (error) {
        console.error("❌ Błąd dodawania klienta:", error);
        return { error: "Nie udało się dodać klienta!" };
    }
};
export const getCustomerById = async (customerId) => {
    try {
        const response = await fetch(`http://localhost:3001/customers/${customerId}`);
        return await response.json();
    } catch (error) {
        console.error("⛔ Błąd pobierania danych klienta:", error);
        return { error: "Nie udało się pobrać danych klienta!" };
    }
};

export const getCustomerOrders = async (customerId) => {
    try {
        const response = await fetch(`http://localhost:3001/customers/${customerId}/orders`);
        return await response.json();
    } catch (error) {
        console.error("⛔ Błąd pobierania zamówień klienta:", error);
        return { error: "Nie udało się pobrać zamówień klienta!" };
    }
};

export const updateCustomer = async (customerId, updatedData) => {
    try {
        const response = await fetch(`http://localhost:3001/customers/${customerId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData),
        });

        return await response.json();
    } catch (error) {
        console.error("⛔ Błąd aktualizacji klienta:", error);
        return { error: "Nie udało się zaktualizować danych klienta!" };
    }
};