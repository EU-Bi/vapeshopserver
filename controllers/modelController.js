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
      const {
        title,
        description,
        brandId,
        price,
        newPrice,
        modelInfo,
        tastes,
      } = req.body;
      // console.log(req.body);
      // console.log(Object.keys(req.files));
      const modelInfoReg = JSON.parse(modelInfo);
      //Создание модели
      let model = await Model.create({
        title,
        brandId,
        description,
        price,
        newPrice,
      });

      //Создание и связывание информации о модели
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
      //Если указаны вкусы, создаем и связываем их с моделью
      if (req.files) {
        for (let i = 0; i < arrTaste.length; i++) {
          const tasteData = arrTaste[i];
          const { title, description, count } = tasteData;
          // console.log(tasteData);
          let photo = req.files[`photo[${i}]`]; // Получаем файл вкуса из req.files
          let fileName = uuid.v4() + ".jpg";
          await photo.mv(path.resolve(__dirname, "..", "static", fileName));
          // console.log(fileName);
          // Создание вкуса и связывание с моделью
          const taste = await Taste.create({ title, description });
          await ModelTaste.create({
            modelId: model.id,
            tasteId: taste.id,
            count: count,
            photo: fileName,
          });
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
      const model = await Model.findByPk(id);
      if (!model) {
        return res.status(404).json({ error: "Модель не найдена" });
      }

      // Обновление основных свойств модели
      model.title = title;
      model.description = description;
      model.price = price;
      model.newPrice = newPrice;
      await model.save();

      // Обновление информации о модели
      const modelInfoReg = JSON.parse(modelInfo);
      if (model.model_info) {
        model.model_info.description = modelInfoReg.description;
        model.model_info.power = modelInfoReg.power;
        model.model_info.nicotine = modelInfoReg.nicotine;
        model.model_info.countSmoke = modelInfoReg.countSmoke;
        model.model_info.charge = modelInfoReg.charge;
        await model.model_info.save();
      }

      // Обновление вкусов модели
      if (tastes) {
        const arrTaste = JSON.parse(tastes);
        for (let i = 0; i < arrTaste.length; i++) {
          const tasteData = arrTaste[i];
          const { id, title, description, count, fileName } = tasteData;

          let photo = req.files[`photo[${i}]`]; // Получаем файл вкуса из req.files
          if (photo) {
            // Если есть новое фото, сохраняем его
            fileName = uuid.v4() + ".jpg";
            await photo.mv(path.resolve(__dirname, "..", "static", fileName));
          }

          // Обновление существующего или создание нового вкуса
          if (id) {
            const modelTaste = await ModelTaste.findOne({
              where: { modelId: model.id, tasteId: id },
            });
            if (modelTaste) {
              modelTaste.count = count;
              if (photo) {
                modelTaste.photo = fileName;
              }
              await modelTaste.save();
            }
          } else {
            const taste = await Taste.create({ title, description });
            await ModelTaste.create({
              modelId: model.id,
              tasteId: taste.id,
              count: count,
              photo: fileName,
            });
          }
        }
      }

      model.tastes = await model.getTastes();

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
