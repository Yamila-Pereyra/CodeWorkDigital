-- Canonical schema for the database selected in MYSQL_DB_NAME.
-- Run this script after creating/selecting the target database.

CREATE TABLE IF NOT EXISTS novedades (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  descripcion TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  fecha_publicacion DATE NOT NULL,
  estado TINYINT(1) NOT NULL DEFAULT 1,
  img_id VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  link VARCHAR(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
