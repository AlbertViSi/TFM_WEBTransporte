const nodesService = require('../services/nodesService');

exports.createSubnode = async (req, res) => {
  try {
    const { name, location, parent_node_id } = req.body;

    if (!name || !location || !parent_node_id) {
      return res.status(400).json({
        error: "name, location y parent_node son obligatorios"
      });
    }

    const subnode = await nodesService.createSubnode(
      name,
      location,
      parent_node_id
    );
    res.status(201).json(subnode);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

exports.getNodes = async (req, res) => {
  try {
    const nodes = await nodesService.getAllNodes();
    res.json(nodes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo nodos" });
  }
};

exports.getMainNodes = async (req, res) => {
  try {
    const nodes = await nodesService.getMainNodes();
    res.json(nodes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo nodos principales" });
  }
};

exports.getSubnodes = async (req, res) => {
  try {
    const subnodes = await nodesService.getSubnodes();
    res.json(subnodes);
  } catch (error) {
    res.status(500).json({ error: "Error obteniendo subnodos" });
  }
};

exports.deleteSubnode = async (req, res) => {
  try {
    const { id } = req.params;
    await nodesService.deleteSubnode(id);
    res.json({ message: "Subnodo eliminado correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.reassignSubnode = async (req, res) => {

  try {
    const { id } = req.params;
    const { new_parent_id } = req.body;
    const result = await nodesService.reassignSubnode(
      id,
      new_parent_id
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAvailableDestinations = async (req, res) => {
  try {

    const { id } = req.params;

    const nodes =
      await nodesService.getAvailableDestinations(id);

    res.json(nodes);

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};