const { Taste } = require("../models/models");
const ApiError = require("../error/ApiError");

class TasteController {
  async create(req, res, next) {
    try {
      let { title, modelId, description, count } = req.body;
      const taste = await Taste.create({ title, modelId, description, count });
      return res.json(taste);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res) {
    const { modelId } = req.query;

    let tastes;

    if (modelId) {
      tastes = await Taste.findAll({
        where: { modelId },
      });
    } else {
      tastes = await Taste.findAll();
    }
    return res.json(tastes);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const taste = await Taste.findOne({
      where: { id },
    });
    return res.json(taste);
  }
}

module.exports = new TasteController();
