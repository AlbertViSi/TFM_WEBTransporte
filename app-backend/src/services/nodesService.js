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

exports.getAvailableDestinations = async (originId) => {

  // Obtener nodo
  const nodeResult = await db.query(
    `
    SELECT id, node_type, parent_node_id
    FROM nodes
    WHERE id = $1
    ORDER BY node_type DESC, name
    `,
    [originId]
  );

  if (nodeResult.rowCount === 0) {
    return [];
  }

  let node = nodeResult.rows[0];

  // Si es subnodo
  if (node.node_type === 'sub') {
    const mainNode = await db.query(
      `
      SELECT id, name, node_type, parent_node_id
      FROM nodes
      WHERE id = $1
      ORDER BY node_type DESC, name
      `,
      [node.parent_node_id]
    );

    //subnodos hermanos
    const subnodes = await db.query(
      `
      SELECT id, name, node_type, parent_node_id
      FROM nodes
      WHERE parent_node_id = $1
      AND id != $2
      `,
      [node.parent_node_id, node.id]
    );

    return [
      ...mainNode.rows,
      ...subnodes.rows
    ];
  }

  // Obtener rutas donde está el nodo
  const routes = await db.query(
    `
    SELECT route_id
    FROM route_nodes
    WHERE node_id = $1
    `,
    [node.id]
  );

  if (routes.rowCount === 0) {
    return [];
  }

  const routeIds = routes.rows.map(r => r.route_id);

  // Obtener nodos de esas rutas
  const nodes = await db.query(
    `
    SELECT DISTINCT n.id, n.name, n.node_type, n.parent_node_id
    FROM route_nodes rn
    JOIN nodes n ON n.id = rn.node_id
    WHERE rn.route_id = ANY($1)
    `,
    [routeIds]
  );

  // Obtener subnodos del nodo principal
  const subnodes = await db.query(
    `
    SELECT id, name, node_type, parent_node_id
    FROM nodes
    WHERE parent_node_id = $1
    `,
    [node.id]
  );

  return [
    ...nodes.rows,
    ...subnodes.rows
  ].filter(n => n.id !== node.id);

};
