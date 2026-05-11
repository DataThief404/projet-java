-- ================================================
-- Gestion de Stock - Initialisation Base de données
-- Utilisateur admin : admin@test.com / admin
-- ================================================

CREATE DATABASE IF NOT EXISTS stock
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE stock;

-- ================================================
-- Les tables seront créées automatiquement par
-- Spring Boot JPA/Hibernate basées sur les
-- @Entity classes du projet
-- ================================================

-- ================================================
-- Données initiales (optionnel)
-- À insérer APRÈS que les tables soient créées
-- par Spring Boot (après le premier démarrage)
-- ================================================

-- Admin user: admin@test.com / admin
-- Password hash (BCrypt): $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT IGNORE INTO users (username, email, password, role, enabled)
VALUES (
    'admin',
    'admin@test.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'ROLE_ADMIN',
    TRUE
);

-- Categories
INSERT IGNORE INTO categorie (nom, description) VALUES
('Informatique', 'Matériel et accessoires informatiques'),
('Téléphonie', 'Téléphones et accessoires'),
('Électroménager', 'Appareils électroménagers');

-- Products
INSERT IGNORE INTO produit (nom, description, prix, quantite_stock, categorie_id) VALUES
('Laptop Dell', 'Ordinateur portable Dell 15 pouces', 1200.00, 10, 1),
('Souris Logitech', 'Souris sans fil Logitech', 45.00, 25, 1),
('iPhone 14', 'Apple iPhone 14 128Go', 1800.00, 8, 2),
('Samsung A54', 'Samsung Galaxy A54', 750.00, 15, 2),
('Machine à café', 'Machine à café automatique', 320.00, 5, 3);