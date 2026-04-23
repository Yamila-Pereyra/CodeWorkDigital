-- Canonical seed for the database selected in MYSQL_DB_NAME.
-- Run this script after database/schema.sql.

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

INSERT INTO novedades (titulo, descripcion, fecha_publicacion, estado, img_id, link) VALUES
  (
    'Tendencias diseno web 2026: claves para adelantarte al futuro',
    'Conoce las tendencias de diseno web para 2026: inspiracion, guia y claves para adelantarte al futuro y entender la nueva estetica digital. El diseno web esta en constante evolucion, y cada ano surgen nuevas tendencias que transforman la manera en que los usuarios interactuan con los sitios.',
    '2026-01-15',
    1,
    NULL,
    NULL
  ),
  (
    '10 elementos de una pagina web de exito',
    'Guia resumida sobre navegacion, paleta de colores, imagenes destacadas y presencia en redes sociales como base de una web efectiva.',
    '2026-02-10',
    1,
    NULL,
    NULL
  ),
  (
    'Prueba interna',
    'Registro de prueba para validar la carga administrativa del modulo de novedades.',
    '2026-03-01',
    0,
    NULL,
    NULL
  );
