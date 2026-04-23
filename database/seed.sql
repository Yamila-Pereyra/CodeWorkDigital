-- Canonical seed for the database selected in MYSQL_DB_NAME.
-- Run this script after database/schema.sql.

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
