-- Canonical schema for the database selected in MYSQL_DB_NAME.
-- Run this script after creating/selecting the target database.

CREATE TABLE IF NOT EXISTS usuarios (
  id INT NOT NULL AUTO_INCREMENT,
  usuario VARCHAR(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  password VARCHAR(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY usuarios_usuario_unique (usuario)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS novedades (
  id INT NOT NULL AUTO_INCREMENT,
  titulo VARCHAR(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  subtitulo TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  cuerpo TEXT COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
