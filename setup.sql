CREATE DATABASE IF NOT EXISTS pt_wordpress;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'wp_password';
GRANT ALL PRIVILEGES ON pt_wordpress.* TO 'admin'@'localhost';