export const isAuthenticated = async () => {
    try {
        const res = await fetch("http://localhost:3001/auth-check", {
            method: "GET",
            credentials: "include",
        });

        const data = await res.json();
        return res.ok && data.authenticated ? data.role : null;
    } catch (error) {
        console.error("Błąd sprawdzania sesji:", error);
        return null;
    }
};
