const bansService = require('../services/bansService');

exports.createBan = async (req, res) => {
  try {
    const { dni, reason, expires_at } = req.body;
    const ban = await bansService.createBan({ dni, reason, expires_at });
    res.status(201).json(ban);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.getBans = async (req, res) => {
  try {
    const bans = await bansService.getBans();
    res.json(bans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBan = async (req, res) => {
  try {
    const { id } = req.params;
    const ban = await bansService.deleteBan(id);
    res.json({ message: "Baneo eliminado", ban });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};
