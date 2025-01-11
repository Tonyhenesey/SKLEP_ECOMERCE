const http = require("http");
const mysql = require("mysql");
const e = require("express");

// 🔹 Konfiguracja bazy danych MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "haslo1234",
    database: "sklep"
});

// 🔹 Połączenie z bazą danych
db.connect(err => {
    if (err) {
        console.error("⛔ Błąd połączenia z MySQL:", err);
        process.exit(1);
    }
    console.log("✅ Połączono z MySQL!");
});

// 🔹 Tworzenie serwera HTTP
const server = http.createServer((req, res) => {
    console.log(`📩 Otrzymano zapytanie: ${req.method} ${req.url}`);

    // 🛑 Obsługa CORS (dla Reacta)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }

    // ✅ Pobieranie listy klientów
    if (req.method === "GET" && req.url === "/customers") {
        db.query("SELECT * FROM customers ORDER BY name ASC", (err, results) => {
            if (err) {
                console.error("⛔ Błąd pobierania klientów:", err);
                res.writeHead(500, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({error: "Błąd pobierania klientów"}));
            }
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(results));
        });
    }

    // ✅ Pobieranie zamówień
    else if (req.method === "GET" && req.url === "/orders") {
        const query = `
            SELECT o.id, o.orderDate, o.address, o.status, 
                   c.name AS customerName, c.surname AS customerSurname
            FROM orders o
            JOIN customers c ON o.customerId = c.id
            ORDER BY o.orderDate DESC
        `;

        db.query(query, (err, results) => {
            if (err) {
                console.error("⛔ Błąd pobierania zamówień:", err);
                res.writeHead(500, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({error: "Błąd pobierania zamówień"}));
            }
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(results));
        });
    }

    // ✅ Pobieranie szczegółów zamówienia
    else if (req.method === "GET" && req.url.startsWith("/orders/")) {
        const orderId = req.url.split("/")[2];

        const query = `
            SELECT o.id, o.orderDate, o.address, o.status, 
                   c.name AS customerName, c.surname AS customerSurname,
                   p.name AS productName, oi.quantity, p.price
            FROM orders o
            JOIN customers c ON o.customerId = c.id
            LEFT JOIN order_items oi ON o.id = oi.orderId
            LEFT JOIN products p ON oi.productId = p.id
            WHERE o.id = ?
        `;

        db.query(query, [orderId], (err, results) => {
            if (err) {
                console.error("⛔ Błąd pobierania szczegółów zamówienia:", err);
                res.writeHead(500, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({error: "Błąd pobierania szczegółów zamówienia"}));
            }

            if (results.length === 0) {
                res.writeHead(404, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({error: "Zamówienie nie istnieje"}));
            }

            const orderDetails = {
                id: results[0].id,
                orderDate: results[0].orderDate,
                address: results[0].address,
                status: results[0].status,
                customerName: results[0].customerName,
                customerSurname: results[0].customerSurname,
                products: results.map(item => ({
                    name: item.productName,
                    quantity: item.quantity,
                    price: item.price
                }))
            };

            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(orderDetails));
        });
    }

    // ✅ Aktualizacja adresu zamówienia
    else if (req.method === "PUT" && req.url.match(/^\/orders\/\d+\/address$/)) {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const orderId = req.url.split("/")[2];
                const {address} = JSON.parse(body);

                // ✅ Sprawdzamy, czy `orderId` i `address` są poprawne
                if (!orderId || isNaN(orderId)) {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({error: "❌ Nieprawidłowe ID zamówienia!"}));
                }

                if (!address || address.trim() === "") {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({error: "❌ Adres nie może być pusty!"}));
                }

                console.log(`📩 Aktualizacja adresu zamówienia #${orderId} na: ${address}`);

                const updateQuery = `UPDATE orders SET address = ? WHERE id = ?`;

                db.query(updateQuery, [address, orderId], (err, result) => {
                    if (err) {
                        console.error("⛔ Błąd SQL przy aktualizacji zamówienia:", err);
                        res.writeHead(500, {"Content-Type": "application/json"});
                        return res.end(JSON.stringify({error: "❌ Błąd serwera podczas aktualizacji zamówienia!"}));
                    }

                    if (result.affectedRows === 0) {
                        res.writeHead(404, {"Content-Type": "application/json"});
                        return res.end(JSON.stringify({error: "❌ Zamówienie nie istnieje!"}));
                    }
                    console.log(`📥 Otrzymane żądanie: ${req.method} ${req.url}`);

                    console.log("✅ Adres zamówienia zaktualizowany!");
                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({message: `✅ Adres zamówienia #${orderId} został zmieniony na: ${address}`}));
                });

            } catch (error) {
                console.error("⛔ Błąd parsowania JSON:", error);
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({error: "❌ Nieprawidłowe dane wejściowe!"}));
            }
        });
    }

    // ✅ Anulowanie zamówienia (zmiana statusu)
    else if (req.method === "PUT" && req.url.startsWith("/orders/") && req.url.endsWith("/cancel")) {
        const orderId = req.url.split("/")[2];

        console.log("🔍 Anulowanie zamówienia:", orderId);

        // 🔹 Krok 1: Zmiana statusu zamówienia na "Anulowane"
        const updateStatusQuery = `UPDATE orders SET status = 'Anulowane' WHERE id = ?`;

        db.query(updateStatusQuery, [orderId], (err, result) => {
            if (err) {
                console.error("⛔ Błąd zmiany statusu zamówienia:", err);
                res.writeHead(500, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({error: "Nie udało się zmienić statusu zamówienia"}));
            }

            console.log("✅ Status zamówienia zaktualizowany na 'Anulowane'!");

            // 🔹 Krok 2: Usunięcie zamówienia z tabeli `orders`
            const deleteOrderQuery = `DELETE FROM orders WHERE id = ?`;

            db.query(deleteOrderQuery, [orderId], (err, result) => {
                if (err) {
                    console.error("⛔ Błąd usuwania zamówienia:", err);
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({error: "Nie udało się usunąć zamówienia"}));
                }

                console.log("✅ Zamówienie usunięte!");
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify({message: `✅ Zamówienie #${orderId} anulowane i usunięte!`}));
            });
        });
    }
    // ✅ Dodawanie nowego zamówienia
    else if (req.method === "POST" && req.url === "/orders") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                console.log("📥 Otrzymane dane:", body);
                const {customerId, address, status, products} = JSON.parse(body);

                if (!customerId || !address || !status || !products || products.length === 0) {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({error: "❌ Brak wymaganych pól lub brak produktów!"}));
                }

                // 🔹 Krok 1: Dodaj zamówienie
                const insertOrderQuery = `INSERT INTO orders (customerId, address, status) VALUES (?, ?, ?)`;

                db.query(insertOrderQuery, [customerId, address, status], (err, result) => {
                    if (err) {
                        console.error("⛔ Błąd dodawania zamówienia:", err);
                        res.writeHead(500, {"Content-Type": "application/json"});
                        return res.end(JSON.stringify({error: "Nie udało się dodać zamówienia"}));
                    }

                    const orderId = result.insertId;
                    console.log("✅ Zamówienie dodane:", orderId);

                    // 🔹 Krok 2: Dodaj produkty do zamówienia
                    const insertItemsQuery = `INSERT INTO order_items (orderId, productId, quantity) VALUES ?`;
                    const orderItems = products.map(product => [orderId, product.productId, product.quantity]);

                    db.query(insertItemsQuery, [orderItems], (err) => {
                        if (err) {
                            console.error("⛔ Błąd dodawania produktów do zamówienia:", err);
                            res.writeHead(500, {"Content-Type": "application/json"});
                            return res.end(JSON.stringify({error: "Nie udało się dodać produktów do zamówienia"}));
                        }

                        console.log("✅ Produkty dodane do zamówienia:", orderItems);
                        res.writeHead(201, {"Content-Type": "application/json"});
                        res.end(JSON.stringify({message: "✅ Zamówienie z produktami dodane!", orderId}));
                    });
                });

            } catch (error) {
                console.error("⛔ Błąd parsowania JSON:", error);
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({error: "❌ Nieprawidłowe dane wejściowe!"}));
            }
        });
    }
    // ✅ Dodawanie nowego klienta
    else if (req.method === "POST" && req.url === "/customers") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                console.log("📥 Otrzymane dane:", body);
                const {name, surname, phone, email, birthDate, address} = JSON.parse(body);

                if (!name || !surname || !phone || !email || !birthDate || !address) {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({error: "❌ Brak wymaganych pól!"}));
                }

                const insertQuery = `
                    INSERT INTO customers (name, surname, phone, email, birthDate, address) 
                    VALUES (?, ?, ?, ?, ?, ?)
                `;

                db.query(insertQuery, [name, surname, phone, email, birthDate, address], (err, result) => {
                    if (err) {
                        console.error("⛔ Błąd dodawania klienta:", err);
                        res.writeHead(500, {"Content-Type": "application/json"});
                        return res.end(JSON.stringify({error: "Nie udało się dodać klienta"}));
                    }

                    console.log("✅ Klient dodany:", result);
                    res.writeHead(201, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({message: "Klient dodany!", customerId: result.insertId}));
                });

            } catch (error) {
                console.error("⛔ Błąd parsowania JSON:", error);
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({error: "❌ Nieprawidłowe dane wejściowe!"}));
            }
        });
    }
    //pobieranie danych klienta
    else if (req.method === "GET" && req.url.startsWith("/customers/")) {
        const parts = req.url.split("/");
        const customerId = parts[2];

        if (parts.length === 3) {
            // 🔹 Pobieranie szczegółów klienta
            const query = `SELECT * FROM customers WHERE id = ?`;

            db.query(query, [customerId], (err, results) => {
                if (err) {
                    console.error("⛔ Błąd pobierania danych klienta:", err);
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({error: "Błąd pobierania danych klienta"}));
                }

                if (results.length === 0) {
                    res.writeHead(404, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({error: "Klient nie istnieje"}));
                }

                console.log("✅ Szczegóły klienta:", results[0]);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(results[0]));
            });
        } else if (parts.length === 4 && parts[3] === "orders") {
            // 🔹 Pobieranie zamówień klienta
            const query = `
            SELECT o.id, o.orderDate, o.address, o.status
            FROM orders o
            WHERE o.customerId = ?
            ORDER BY o.orderDate DESC
        `;

            db.query(query, [customerId], (err, results) => {
                if (err) {
                    console.error("⛔ Błąd pobierania zamówień klienta:", err);
                    res.writeHead(500, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({error: "Błąd pobierania zamówień klienta"}));
                }

                console.log("✅ Zamówienia klienta:", results);
                res.writeHead(200, {"Content-Type": "application/json"});
                res.end(JSON.stringify(results));
            });
        }
    }

// ✅ Aktualizacja danych klienta
    else if (req.method === "PUT" && req.url.startsWith("/customers/")) {
        let body = "";
        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                const customerId = req.url.split("/")[2];
                const {name, surname, phone, email, birthDate, address} = JSON.parse(body);

                if (!name || !surname || !phone || !email || !birthDate || !address) {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({error: "❌ Brak wymaganych pól!"}));
                }

                const updateQuery = `
                UPDATE customers 
                SET name = ?, surname = ?, phone = ?, email = ?, birthDate = ?, address = ? 
                WHERE id = ?
            `;

                db.query(updateQuery, [name, surname, phone, email, birthDate, address, customerId], (err, result) => {
                    if (err) {
                        console.error("⛔ Błąd aktualizacji klienta:", err);
                        res.writeHead(500, {"Content-Type": "application/json"});
                        return res.end(JSON.stringify({error: "Nie udało się zaktualizować danych klienta"}));
                    }

                    res.writeHead(200, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({message: "✅ Dane klienta zaktualizowane!"}));
                });

            } catch (error) {
                console.error("⛔ Błąd parsowania JSON:", error);
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({error: "❌ Nieprawidłowe dane wejściowe!"}));
            }
        });
    }
    // ✅ Dodawanie nowego produktu do magazynu
    else if (req.method === "POST" && req.url === "/stock") {
        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", () => {
            try {
                console.log("📥 Otrzymane dane:", body);
                const {name, price, stock} = JSON.parse(body);

                if (!name || !price || !stock) {
                    res.writeHead(400, {"Content-Type": "application/json"});
                    return res.end(JSON.stringify({error: "❌ Brak wymaganych pól!"}));
                }

                const insertQuery = `INSERT INTO products (name, price, stock) VALUES (?, ?, ?)`;

                db.query(insertQuery, [name, price, stock], (err, result) => {
                    if (err) {
                        console.error("⛔ Błąd dodawania produktu:", err);
                        res.writeHead(500, {"Content-Type": "application/json"});
                        return res.end(JSON.stringify({error: "Nie udało się dodać produktu"}));
                    }

                    console.log("✅ Produkt dodany:", result);
                    res.writeHead(201, {"Content-Type": "application/json"});
                    res.end(JSON.stringify({message: "Produkt dodany!", productId: result.insertId}));
                });

            } catch (error) {
                console.error("⛔ Błąd parsowania JSON:", error);
                res.writeHead(400, {"Content-Type": "application/json"});
                res.end(JSON.stringify({error: "❌ Nieprawidłowe dane wejściowe!"}));
            }
        });
    }
    // 📌 Pobieranie pełnej listy produktów
    if (req.method === "GET" && req.url === "/stock") {
        db.query("SELECT id, name AS product, price, stock AS quantity FROM products", (err, results) => {
            if (err) {
                console.error("⛔ Błąd pobierania stanu magazynowego:", err);
                res.writeHead(500, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({error: "Błąd pobierania danych magazynowych"}));
            }

            console.log("✅ Dane magazynowe pobrane:", results);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(results));
        });
    }

// 📌 Pobieranie produktu po ID
    else if (req.method === "GET" && req.url.startsWith("/stock/")) {
        const productId = req.url.split("/")[2];

        const query = "SELECT id, name AS product, price, stock AS quantity FROM products WHERE id = ?";

        db.query(query, [productId], (err, results) => {
            if (err) {
                console.error("⛔ Błąd pobierania produktu:", err);
                res.writeHead(500, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({error: "Błąd pobierania produktu"}));
            }

            if (results.length === 0) {
                res.writeHead(404, {"Content-Type": "application/json"});
                return res.end(JSON.stringify({error: "Produkt nie istnieje"}));
            }

            console.log("✅ Produkt pobrany:", results[0]);
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(results[0]));
        });
    }

    // ✅ Logowanie użytkownika
    else if (req.method === "POST" && req.url === "/login") {
        let body = "";

        req.on("data", chunk => { body += chunk; });

        req.on("end", () => {
            try {
                const { username, password } = JSON.parse(body);

                if (!username || !password) {
                    res.writeHead(400, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: "Brak wymaganych danych!" }));
                }

                const query = "SELECT * FROM users WHERE email = ? AND password = ?";

                db.query(query, [username, password], (err, results) => {
                    if (err) {
                        console.error("⛔ Błąd SQL:", err);
                        res.writeHead(500, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ error: "Błąd logowania" }));
                    }

                    if (results.length === 0) {
                        res.writeHead(401, { "Content-Type": "application/json" });
                        return res.end(JSON.stringify({ error: "Nieprawidłowy login lub hasło!" }));
                    }

                    const user = results[0];

                    // ✅ Zapisz log logowania
                    db.query("INSERT INTO user_logs (user_id) VALUES (?)", [user.id]);

                    console.log(`✅ Użytkownik ${username} zalogowany!`);

                    // 🏷️ Zwracamy dane użytkownika (bez hasła)
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(JSON.stringify({
                        message: "Zalogowano pomyślnie!",
                        user: { id: user.id, username: user.username, role: user.role }
                    }));
                });

            } catch (error) {
                console.error("⛔ Błąd parsowania JSON:", error);
                res.writeHead(400, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Nieprawidłowe dane wejściowe!" }));
            }
        });
    }

    // ✅ Pobieranie logów logowań (tylko dla admina)
    else if (req.method === "GET" && req.url === "/logs") {
        const authHeader = req.headers["authorization"];
        if (!authHeader || authHeader !== "admin") {
            res.writeHead(403, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ error: "Brak dostępu!" }));
        }

        db.query(
            "SELECT user_logs.id, users.username, user_logs.login_time FROM user_logs JOIN users ON user_logs.user_id = users.id ORDER BY login_time DESC",
            (err, results) => {
                if (err) {
                    console.error("⛔ Błąd pobierania logów:", err);
                    res.writeHead(500, { "Content-Type": "application/json" });
                    return res.end(JSON.stringify({ error: "Błąd pobierania logów" }));
                }

                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify(results));
            }
        );
    }
});
// 🔹 Uruchomienie serwera
    server.listen(3001, () => console.log("🚀 Serwer działa na porcie 3001"));
