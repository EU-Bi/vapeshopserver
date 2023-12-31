const { Type, Brand } = require("../models/models");
const ApiError = require("../error/ApiError");

class TypeController {
  async create(req, res, next) {
    try {
      const { title, brandIds } = req.body;

      // Создание типа
      const type = await Type.create({ title });

      // Если указаны brandIds, связываем тип с брендами
      if (brandIds && brandIds.length > 0) {
        const brands = await Brand.findAll({ where: { id: brandIds } });
        if (brands.length !== brandIds.length) {
          return res
            .status(404)
            .json({ error: "One or more brands not found" });
        }
        await type.setBrands(brands);
      }

      res.json(type);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res) {
    try {
      // Получение всех типов
      const types = await Type.findAll();

      // Перебор типов и получение массива брендов для каждого типа
      const typesWithBrands = await Promise.all(
        types.map(async (type) => {
          const brands = await type.getBrands();
          return {
            id: type.id,
            title: type.title,
            brands: brands,
          };
        })
      );

      res.status(200).json(typesWithBrands);
    } catch (error) {
      res.status(500).json({ error: "Failed to get types with brands" });
    }
  }
  async getOne(req, res) {
    const { id } = req.params;
    const type = await Type.findOne({
      where: { id },
      include: [{ model: TypeInfo, as: "info" }],
    });
    console.log(id);
    return res.json(type);
  }
  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const type = await Type.findByPk(id);
      if (!type) {
        return res.status(404).json({ error: "Тип не найден" });
      }

      await type.destroy();

      res.status(200).json({ message: "Тип успешно удален" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { title, brandIds } = req.body;

    try {
      const type = await Type.findByPk(id);
      if (!type) {
        return res.status(404).json({ error: "Тип не найден" });
      }

      await type.update({ title });

      if (brandIds && brandIds.length > 0) {
        const brands = await Brand.findAll({ where: { id: brandIds } });
        if (brands.length !== brandIds.length) {
          return res
            .status(404)
            .json({ error: "Один или несколько брендов не найдены" });
        }
        await type.setBrands(brands);
      }

      res.status(200).json(type);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new TypeController();
