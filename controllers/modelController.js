const { Model, ModelInfo } = require("../models/models");
const ApiError = require("../error/ApiError");

class ModelController {
  async create(req, res, next) {
    try {
      let { title, description, price, newPrice, typeId, brandId, info } =
        req.body;
      const model = await Model.create({
        title,
        description,
        newPrice,
        price,
        typeId,
        brandId,
      });

      if (info) {
        info = JSON.parse(info);
        info.forEach((i) => {
          ModelInfo.create({
            description: i.description,
            power: i.power,
            nicotine: i.nicotine,
            countSmoke: i.countSmoke,
            charge: i.charge,
            modelId: model.id,
          });
        });
      }
      return res.json(model);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res) {
    const models = await Model.findAll();
    return res.json(models);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const model = await Model.findOne({
      where: { id },
      include: [{ info: ModelInfo, as: "info" }],
    });
    console.log(id);
    return res.json(model);
  }
}
module.exports = new ModelController();
