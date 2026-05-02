const db = require('../config/db');

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = deg => deg * Math.PI / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat/2) ** 2 +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon/2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

exports.searchRoutes = async (origin_node_id, destination_node_id, departure_date) => {
  const isValid = await validateNodes(origin_node_id, destination_node_id);

  if (!isValid) {
    throw new Error("Origen y destino no están conectados");
  }

  //Logica si hay subnodos
  const originNode = await db.query(
    `SELECT * FROM nodes WHERE id = $1`,
    [origin_node_id]
  );

  const destinationNode = await db.query(
    `SELECT * FROM nodes WHERE id = $1`,
    [destination_node_id]
  );

  const origin = originNode.rows[0];
  const destination = destinationNode.rows[0];

  if (origin.node_type === "sub" || destination.node_type === "sub") {
    const distance = getDistance(
      origin.latitude,
      origin.longitude,
      destination.latitude,
      destination.longitude
    );
    const price = distance * 0.1;

    return [{
      route_id: null,
      route_name: "Viaje local",
      estimated_distance: distance,
      estimated_price: price,
      available_seats: 999
    }];
  }

  //Logica main nodes
  const routes = await db.query(
    `
    SELECT DISTINCT r.id, r.name, r.base_price, r.capacity
    FROM routes r
    JOIN route_nodes rn1 ON rn1.route_id = r.id
    JOIN route_nodes rn2 ON rn2.route_id = r.id
    WHERE rn1.node_id = $1
    AND rn2.node_id = $2
    `,
    [origin_node_id, destination_node_id]
  );
  const results = [];

  for (const route of routes.rows) {
    const nodesOrder = await db.query(
      `
      SELECT node_id, node_order
      FROM route_nodes
      WHERE route_id = $1
      AND node_id IN ($2, $3)
      `,
      [route.id, origin_node_id, destination_node_id]
    );

    if (nodesOrder.rowCount !== 2) continue;

    let originOrder, destOrder;

    nodesOrder.rows.forEach(n => {
      if (n.node_id == origin_node_id) originOrder = n.node_order;
      if (n.node_id == destination_node_id) destOrder = n.node_order;
    });

    const minOrder = Math.min(originOrder, destOrder);
    const maxOrder = Math.max(originOrder, destOrder);
    const nodes = await db.query(
      `
      SELECT n.latitude, n.longitude, rn.node_order
      FROM route_nodes rn
      JOIN nodes n ON rn.node_id = n.id
      WHERE rn.route_id = $1
      AND rn.node_order BETWEEN $2 AND $3
      ORDER BY rn.node_order
      `,
      [route.id, minOrder, maxOrder]
    );

    let totalDistance = 0;

    for (let i = 0; i < nodes.rows.length - 1; i++) {
      const n1 = nodes.rows[i];
      const n2 = nodes.rows[i + 1];

      totalDistance += getDistance(
        n1.latitude,
        n1.longitude,
        n2.latitude,
        n2.longitude
      );
    }

    const estimatedPrice = totalDistance * 0.1 * route.base_price;
    const reservationsCount = await db.query(
      `
      SELECT COUNT(*)
      FROM reservations
      WHERE route_id = $1
      AND departure_date = $2
      AND status != 'cancelado'
      `,
      [route.id, departure_date]
    );
    const availableSeats =
      route.capacity - parseInt(reservationsCount.rows[0].count);

    results.push({
      route_id: route.id,
      route_name: route.name,
      estimated_distance: totalDistance,
      estimated_price: estimatedPrice,
      available_seats: availableSeats
    });
  }
  return results;
};

exports.updateCapacity = async (routeId, capacity) => {
  if (capacity <= 0) {
    throw new Error("La capacidad debe ser mayor que 0");
  }

  const result = await db.query(
    `
    UPDATE routes
    SET capacity = $1
    WHERE id = $2
    RETURNING id, name, capacity
    `,
    [capacity, routeId]
  );

  if (result.rowCount === 0) {
    throw new Error("Ruta no encontrada");
  }
  return result.rows[0];
};

exports.updateBasePrice = async (routeId, basePrice) => {
  if (basePrice <= 0) throw new Error("El base_price debe ser mayor que 0");

  const result = await db.query(
    `UPDATE routes
     SET base_price = $1
     WHERE id = $2
     RETURNING id, name, base_price`,
    [basePrice, routeId]
  );

  if (result.rowCount === 0) throw new Error("Ruta no encontrada");
  return result.rows[0];
};

exports.getAllRoutes = async () => {
  const result = await db.query(`
    SELECT id, name, base_price, capacity
    FROM routes
    ORDER BY name
  `);
  return result.rows;
};

async function validateNodes(originId, destinationId) {

  // Obtener nodos
  const nodes = await db.query(
    `
    SELECT id, node_type, parent_node_id
    FROM nodes
    WHERE id IN ($1, $2)
    `,
    [originId, destinationId]
  );

  if (nodes.rowCount !== 2) return false;

  const origin = nodes.rows.find(n => n.id == originId);
  const destination = nodes.rows.find(n => n.id == destinationId);

  // subnodo -> nodo principal
  if (origin.parent_node_id === destination.id) return true;
  if (destination.parent_node_id === origin.id) return true;

  // mismo parent
  if (
    origin.parent_node_id &&
    origin.parent_node_id === destination.parent_node_id
  ) return true;

  // comprobar misma ruta
  const routeCheck = await db.query(
    `
    SELECT 1
    FROM route_nodes rn1
    JOIN route_nodes rn2
      ON rn1.route_id = rn2.route_id
    WHERE rn1.node_id = $1
    AND rn2.node_id = $2
    LIMIT 1
    `,
    [originId, destinationId]
  );

  return routeCheck.rowCount > 0;
}

async function validateNodes(origin_node_id, destination_node_id) {
  const nodes = await db.query(
    `
    SELECT id, node_type, parent_node_id
    FROM nodes
    WHERE id IN ($1, $2)
    `,
    [origin_node_id, destination_node_id]
  );

  if (nodes.rowCount !== 2) return false;

  const origin = nodes.rows.find(n => n.id == origin_node_id);
  const destination = nodes.rows.find(n => n.id == destination_node_id);

  if (origin.parent_node_id === destination.id) return true;
  if (destination.parent_node_id === origin.id) return true;

  if (
    origin.parent_node_id &&
    origin.parent_node_id === destination.parent_node_id
  ) return true;

  const routeCheck = await db.query(
    `
    SELECT 1
    FROM route_nodes rn1
    JOIN route_nodes rn2
    ON rn1.route_id = rn2.route_id
    WHERE rn1.node_id = $1
    AND rn2.node_id = $2
    LIMIT 1
    `,
    [origin_node_id, destination_node_id]
  );

  return routeCheck.rowCount > 0;
}

exports.getRouteDetail = async (route_id) => {

  if (Number(route_id) === 0) {
    return {
      route: {
        id: 0,
        name: 'Viaje local'
      },
      rating_avg: 0,
      rating_count: 0,
      comments: []
    };
  };

  const route = await db.query(
    `
    SELECT id, name
    FROM routes
    WHERE id = $1
    `,
    [route_id]
  );
  const rating = await db.query(
    `
    SELECT AVG(rating) as rating_avg, COUNT(*) as rating_count
    FROM ratings
    WHERE route_id = $1
    `,
    [route_id]
  );
  const comments = await db.query(
    `
    SELECT c.content, c.user_id, c.created_at, u.username
    FROM comments c
    JOIN users u 
      ON u.id = c.user_id
    WHERE c.route_id = $1
    ORDER BY c.created_at DESC
    `,
    [route_id]
  );

  return {
    route: route.rows[0],
    rating_avg: Number(Number(rating.rows[0].rating_avg).toFixed(1)) || 0,
    rating_count: Number(Number(rating.rows[0].rating_count).toFixed(1)) || 0,
    comments: comments.rows
  };
};