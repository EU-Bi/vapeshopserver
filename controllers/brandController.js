const { Brand, Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res) {
    try {
      try {
        const { title } = req.body;
        const brand = await Brand.create({ title });
        res.json(brand);
      } catch (error) {
        res.status(500).json({ error: 'Failed to create brand' });
      }
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const brands = await Brand.findAll({
        include: {
          model: Type,
          as: 'types',
          attributes: ['id', 'title'],
          through: { attributes: [] },
        },
      });
      res.json(brands);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve brands' });
    }
  }
}


module.exports = new BrandController();
