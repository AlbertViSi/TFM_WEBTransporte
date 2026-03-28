const db = require('../config/db');
const mapsService = require('./mapsService');

exports.createSubnode = async (name, locationName, parent_node_id) => {
  //Evitar duplicados
  const existingNode = await db.query(
    `
    SELECT id, node_type
    FROM nodes
    WHERE LOWER(name) = LOWER($1)
    `,
    [name]
  );
  if (existingNode.rowCount > 0) {
    throw new Error("Ya existe un nodo con ese nombre");
  }

  //Obtener coordenadas de la API externa
  const coords = await mapsService.getCoordinates(locationName);
  const latitude = coords.latitude;
  const longitude = coords.longitude;

  //Insertar subnodo
  const result = await db.query(    
    `
    INSERT INTO nodes (name, latitude, longitude, node_type, parent_node_id)
    VALUES ($1,$2,$3,'sub',$4)
    RETURNING *
    `,
    [name, latitude, longitude, parent_node_id]
  );
  return result.rows[0];
};

exports.getAllNodes = async () => {
  const result = await db.query(`
    SELECT id, name, node_type, parent_node_id
    FROM nodes
    ORDER BY node_type DESC, name
  `);
  return result.rows;
};

exports.getMainNodes = async () => {
  const result = await db.query(
    `
    SELECT id, name, latitude, longitude
    FROM nodes
    WHERE node_type = 'main'
    ORDER BY name
    `
  );
  return result.rows;
};

exports.getSubnodes = async () => {
  const result = await db.query(
    `
    SELECT id, name, latitude, longitude, parent_node_id
    FROM nodes
    WHERE node_type = 'sub'
    ORDER BY id
    `
  );
  return result.rows;
};

exports.deleteSubnode = async (id) => {
  const result = await db.query(
    `
    DELETE FROM nodes
    WHERE id = $1
    AND node_type = 'sub'
    RETURNING id
    `,
    [id]
  );

  if (result.rowCount === 0)
    throw new Error("Subnodo no encontrado");
};

exports.reassignSubnode = async (id, new_parent_id) => {
  const result = await db.query(
    `
    UPDATE nodes
    SET parent_node_id = $1
    WHERE id = $2
    AND node_type = 'sub'
    RETURNING *
    `,
    [new_parent_id, id]
  );

  if (result.rowCount === 0)
    throw new Error("Subnodo no encontrado");
  return result.rows[0];
};