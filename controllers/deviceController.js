const {
  Device,
  Taste,
  Type,
  Brand,
  Model,
  ModelInfo,
  ModelTaste,
} = require("../models/models");
const ApiError = require("../error/ApiError");

class DeviceController {
  async create(req, res, next) {
    try {
      const { typeId, modelId, brandId } = req.body;
      const model = await Model.findOne({
        where: { id: modelId },
        include: [
          { model: ModelInfo, as: "model_info" },
          { model: Taste, as: "tastes" },
        ],
      });

      // Проверка, есть ли вкусы у модели
      if (!model.tastes || model.tastes.length === 0) {
        return res.status(400).json({ error: "Модель не содержит вкусов" });
      }

      // Создание девайсов для каждого вкуса
      const createdDevices = await Promise.all(
        model.tastes.map(async (taste) => {
          const device = await Device.create({
            typeId,
            modelId,
            brandId,
            tasteId: taste.id, // Указываем конкретный вкус для девайса
          });
          return device;
        })
      );

      // Получение полной информации о типе
      const type = await Type.findByPk(typeId);

      // Получение полной информации о бренде
      const brand = await Brand.findOne({
        where: { id: brandId },
        include: [{ model: Type, as: "types" }],
      });

      // Формирование результата
      const result = {
        devices: createdDevices,
        type,
        model,
        brand,
      };

      res.status(201).json(result);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ error: "Устройство не найдено" });
      }

      await device.destroy();

      res.status(200).json({ message: "Устройство успешно удалено" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { typeId, modelId, brandId } = req.body;

    try {
      const device = await Device.findByPk(id);
      if (!device) {
        return res.status(404).json({ error: "Устройство не найдено" });
      }

      await device.update({ typeId, modelId, brandId });

      res.status(200).json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 12;

    let offset = page * limit - limit;
    let devices;
    try {
      devices = await Device.findAndCountAll({
        include: [
          { model: Type, as: "type", include: { model: Brand, as: "brands" } },
          { model: Brand, as: "brand", include: { model: Type, as: "types" } },
          {
            model: Model,
            include: [
              { model: ModelInfo, as: "model_info" },
              { model: Taste, as: "tastes", through: ModelTaste },
            ],
          },
        ],
        limit,
        offset,
      });
      const devicesWithInfo = devices.rows.map((device) => ({
        id: device.id,
        typeId: device.type.id,
        type: device.type.title,
        brandId: device.brand.id,
        brand: device.brand.title,
        modelId: device.model.id,
        createdAt: device.createdAt,
        updatedAt: device.updatedAt,
        model: {
          title: device.model.title,
          description: device.model.description,
          price: device.model.price,
          newPrice: device.model.newPrice,
          info: {
            description: device.model.model_info.description,
            power: device.model.model_info.power,
            nicotine: device.model.model_info.nicotine,
            countSmoke: device.model.model_info.countSmoke,
            charge: device.model.model_info.charge,
          },
          tastes: device.model.tastes.map((taste) => ({
            id: taste.id,
            title: taste.title,
            description: taste.description,
            photo: taste.model_taste.photo,
            count: taste.model_taste.count,
          })),
        },
      }));

      res.status(200).json(devicesWithInfo);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({ where: { id } });
    return res.json(device);
  }
}

module.exports = new DeviceController();
