const routesService = require('../services/routesService');

exports.searchRoutes = async (req, res) => {
  try {
    const { origin_node_id, destination_node_id, departure_date } = req.query;

    if (!origin_node_id || !destination_node_id || !departure_date) {
      return res.status(400).json({
        error: "Faltan parámetros"
      });
    }

    const routes = await routesService.searchRoutes(
      origin_node_id,
      destination_node_id,
      departure_date
    );
    
    res.json(routes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateCapacity = async (req, res) => {
  try {
    const routeId = req.params.id;
    const { capacity } = req.body;

    if (!capacity) {
      return res.status(400).json({
        error: "capacity es obligatorio"
      });
    }

    const route = await routesService.updateCapacity(routeId, capacity);

    res.json({
      message: "Capacidad actualizada",
      route
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      error: error.message
    });
  }
};

exports.updateBasePrice = async (req, res) => {
  try {
    const routeId = req.params.id;
    const { base_price } = req.body;

    if (!base_price) return res.status(400).json({ error: "base_price es obligatorio" });

    const route = await routesService.updateBasePrice(routeId, base_price);

    res.json({ message: "Base price actualizado", route });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

const routesService = require('../services/routesService');

exports.getAllRoutes = async (req, res) => {
  try {
    const routes = await routesService.getAllRoutes();
    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
