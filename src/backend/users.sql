CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'employee') NOT NULL
);

INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@sklep.pl', 'admin123', 'admin'),
('Pracownik', 'pracownik@sklep.pl', 'pracownik123', 'employee');
