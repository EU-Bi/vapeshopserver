const uuid = require("uuid");
const path = require("path");
const { Model, ModelInfo, ModelTaste, Taste } = require("../models/models");
const ApiError = require("../error/ApiError");

Model.prototype.setModelInfo = async function (modelInfo, modelId) {
  // Связывание модели и информации о модели
  this.infoId = modelInfo.id;
  this.id = modelId;
  await this.save();
};

ModelTaste.prototype.setTaste = async function (taste) {
  this.tasteId = taste.id;
  await this.save();
};

ModelTaste.prototype.setModel = async function (model) {
  this.modelId = model.id;
  await this.save();
};

Model.prototype.addTaste = async function (tasteData, options) {
  const { title, description, count } = tasteData;
  const taste = await Taste.create({ title, description });
  await ModelTaste.create({
    modelId: this.id,
    tasteId: taste.id,
    count: count,
    photo: tasteData.fileName,
  });
};

class ModelController {
  async create(req, res, next) {
    try {
      const { title, description, price, newPrice, modelInfo, tastes } =
        req.body;

      const modelInfoReg = JSON.parse(modelInfo);
      // Создание модели
      let model = await Model.create({ title, description, price, newPrice });

      // Создание и связывание информации о модели
      const modelInfoInstance = await ModelInfo.create({
        description: modelInfoReg.description,
        power: modelInfoReg.power,
        nicotine: modelInfoReg.nicotine,
        countSmoke: modelInfoReg.countSmoke,
        charge: modelInfoReg.charge,
        modelId: model.id,
      });
      await model.setModelInfo(modelInfoInstance, model.id);

      const arrTaste = JSON.parse(tastes);

      // Если указаны вкусы, создаем и связываем их с моделью
      if (req.files && req.files.photo && req.files.photo.length > 0) {
        console.log(req.files);
        for (let i = 0; i < arrTaste.length; i++) {
          const tasteData = arrTaste[i];
          const { title, description, count } = tasteData;
          console.log(tasteData);
          console.log();
          console.log(req.files.photo[i]);
          let photo = req.files.photo[i]; // Получаем файл вкуса из req.files
          let fileName = uuid.v4() + ".jpg";
          await photo.mv(path.resolve(__dirname, "..", "static", fileName));

          // Создание вкуса и связывание с моделью
          await model.addTaste({ title, description, count, fileName });
        }
      }

      model = await Model.findOne({
        where: { id: model.id },
        include: [
          { model: ModelInfo, as: "model_info" },
          { model: Taste, as: "tastes" },
        ],
      });

      res.status(201).json(model);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    const { id } = req.params;

    try {
      const model = await Model.findByPk(id);
      if (!model) {
        return res.status(404).json({ error: "Модель не найдена" });
      }

      await model.destroy();

      res.status(200).json({ message: "Модель успешно удалена" });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { title, description, price, newPrice, modelInfo, tastes } = req.body;

    try {
      let model = await Model.findByPk(id);
      if (!model) {
        return res.status(404).json({ error: "Модель не найдена" });
      }

      const modelInfoReg = JSON.parse(modelInfo);
      await model.update({ title, description, price, newPrice });

      if (modelInfo) {
        const modelInfoInstance = await ModelInfo.findOne({
          where: { modelId: model.id },
        });
        if (modelInfoInstance) {
          await modelInfoInstance.update({
            description: modelInfoReg.description,
            power: modelInfoReg.power,
            nicotine: modelInfoReg.nicotine,
            countSmoke: modelInfoReg.countSmoke,
            charge: modelInfoReg.charge,
          });
        } else {
          await ModelInfo.create({
            description: modelInfoReg.description,
            power: modelInfoReg.power,
            nicotine: modelInfoReg.nicotine,
            countSmoke: modelInfoReg.countSmoke,
            charge: modelInfoReg.charge,
            modelId: model.id,
          });
        }
      }

      if (tastes && req.files && req.files.photo && req.files.photo.length > 0) {
        await ModelTaste.destroy({ where: { modelId: model.id } });

        const arrTaste = JSON.parse(tastes);
        for (let i = 0; i < arrTaste.length; i++) {
          const tasteData = arrTaste[i];
          const { title, description, count } = tasteData;

          let photo = req.files.photo[i];
          let fileName = uuid.v4() + ".jpg";
          await photo.mv(path.resolve(__dirname, "..", "static", fileName));

          await model.addTaste({ title, description, count, fileName });
        }
      }

      model = await Model.findOne({
        where: { id: model.id },
        include: [
          { model: ModelInfo, as: "model_info" },
          { model: Taste, as: "tastes" },
        ],
      });

      res.status(200).json(model);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const models = await Model.findAll({
        include: [
          { model: ModelInfo, as: "model_info" },
          { model: Taste, as: "tastes" },
        ],
      });

      return res.json(models);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getOne(req, res) {
    const { id } = req.params;
    const model = await Model.findOne({
      where: { id },
      include: [{ model: ModelInfo, as: "model_info" }],
    });

    return res.json(model);
  }
}

module.exports = new ModelController();
