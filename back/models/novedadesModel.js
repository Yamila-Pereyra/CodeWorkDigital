var pool = require("./bd");
var { normalizeNovedadRow } = require("../lib/novedadesContract");

async function getNovedades() {
  var query = `
    SELECT id, titulo, subtitulo, cuerpo
    FROM novedades
  `;
  var rows = await pool.query(query);
  return rows.map(normalizeNovedadRow);
}

async function getPublicNovedades() {
  return getNovedades();
}

async function insertNovedad(obj) {
  try {
    var query = "INSERT INTO novedades SET ?";
    var rows = await pool.query(query, [obj]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function deleteNovedadesById(id) {
  var query = "DELETE FROM novedades WHERE id = ?";
  var rows = await pool.query(query, [id]);
  return rows;
}

async function getNovedadById(id) {
  var query = `
    SELECT id, titulo, subtitulo, cuerpo
    FROM novedades
    WHERE id = ?
  `;
  var rows = await pool.query(query, [id]);
  return rows[0] ? normalizeNovedadRow(rows[0]) : null;
}

async function modificarNovedadById(obj, id) {
  try {
    var query = "UPDATE novedades SET ? WHERE id = ?";
    var rows = await pool.query(query, [obj, id]);
    return rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  getNovedades,
  getPublicNovedades,
  insertNovedad,
  deleteNovedadesById,
  getNovedadById,
  modificarNovedadById,
};
