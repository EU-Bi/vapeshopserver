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
      return res.status(500).json({ error: "Failed to get tastes" });
    }
  }
  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const taste = await Taste.findByPk(id);
      if (!taste) {
        return res.status(404).json({ error: "Вкус не найден" });
      }

      await taste.destroy();

      res.status(200).json({ message: "Вкус успешно удален" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
      const taste = await Taste.findByPk(id);
      if (!taste) {
        return res.status(404).json({ error: "Вкус не найден" });
      }

      await taste.update({ title, description });

      res.status(200).json(taste);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new TasteController();
