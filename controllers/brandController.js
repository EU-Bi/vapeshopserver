const { Brand, Type } = require("../models/models");
const ApiError = require("../error/ApiError");

class BrandController {
  async create(req, res) {
    try {
      const { title } = req.body;
      const brand = await Brand.create({ title });
      res.json(brand);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create brand' });
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        return res.status(404).json({ error: 'Brand not found' });
      }

      await brand.destroy();

      res.status(200).json({ message: 'Brand deleted successfully' });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { title } = req.body;

    try {
      const brand = await Brand.findByPk(id);
      if (!brand) {
        return res.status(404).json({ error: 'Brand not found' });
      }

      await brand.update({ title });

      res.status(200).json(brand);
    } catch (e) {
      next(ApiError.badRequest(e.message));
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
