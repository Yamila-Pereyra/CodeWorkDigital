-- Canonical seed for the database selected in MYSQL_DB_NAME.
-- Run this script after database/schema.sql.
-- This seed is idempotent for the bootstrap admin and for the legacy novedades below.

-- Bootstrap admin user:
-- usuario: admin
-- password: admin1234
-- Change this password after the first successful login.
INSERT INTO usuarios (usuario, password)
SELECT
  'admin',
  'scrypt$04d05a6ed80d9cc02cf8c4fa46ba6e5c$3658cfdfacfa099947a015955678d4871e8ef178bbb7ca498a4b3ee4fa6f4069645579313f4824f42188268877987dfb0d8b3306010e614968ae739c2e4cb58c'
WHERE NOT EXISTS (
  SELECT 1
  FROM usuarios
  WHERE usuario = 'admin'
);

-- Legacy novedades bootstrap rows.
-- Idempotence criteria: titulo for each seeded row.
INSERT INTO novedades (titulo, subtitulo, cuerpo)
SELECT
  'Tendencias diseno web 2026: claves para adelantarte al futuro',
  'Inspiracion, guia y claves para adelantarte al futuro.',
  'Conoce las tendencias de diseno web para 2026 y entiende como evoluciona la estetica digital y la manera en que los usuarios interactuan con los sitios.'
WHERE NOT EXISTS (
  SELECT 1
  FROM novedades
  WHERE titulo = 'Tendencias diseno web 2026: claves para adelantarte al futuro'
);

INSERT INTO novedades (titulo, subtitulo, cuerpo)
SELECT
  '10 elementos de una pagina web de exito',
  'Bases para una web efectiva.',
  'Guia resumida sobre navegacion, paleta de colores, imagenes destacadas y presencia en redes sociales.'
WHERE NOT EXISTS (
  SELECT 1
  FROM novedades
  WHERE titulo = '10 elementos de una pagina web de exito'
);

INSERT INTO novedades (titulo, subtitulo, cuerpo)
SELECT
  'Prueba interna',
  'Validacion administrativa.',
  'Registro de prueba para validar la carga administrativa del modulo de novedades.'
WHERE NOT EXISTS (
  SELECT 1
  FROM novedades
  WHERE titulo = 'Prueba interna'
);
