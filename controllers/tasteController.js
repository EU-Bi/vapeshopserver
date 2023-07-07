const { Taste, TasteInfo } = require("../models/models");
const ApiError = require("../error/ApiError");

class TasteController {
  async create(req, res, next) {
    try {
      let { title, description } = req.body;
      const taste = await Taste.create({ title, description });
      return res.json(taste);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res) {
    try {
      const tastes = await Taste.findAll();
      return res.json(tastes);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to get tastes' });
    }
  }
}

module.exports = new TasteController();
