-- Optional: run once in MySQL Workbench. (The app also creates the database by itself.)
-- Tables are created automatically by Spring Boot / Hibernate on first start.
CREATE DATABASE IF NOT EXISTS dentalclinicdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Optional: a dedicated user instead of root (then set DB_USERNAME=clinic_user and DB_PASSWORD=ClinicPass@123)
-- CREATE USER IF NOT EXISTS 'clinic_user'@'localhost' IDENTIFIED BY 'ClinicPass@123';
-- GRANT ALL PRIVILEGES ON dentalclinicdb.* TO 'clinic_user'@'localhost';
-- FLUSH PRIVILEGES;

-- After the first run, check the tables:
-- USE dentalclinicdb; SHOW TABLES; SELECT id, name, email, role FROM users;
