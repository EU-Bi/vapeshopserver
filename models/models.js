const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Admin = sequelize.define("admin", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  login: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
});

const User = sequelize.define("User", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING },
  telephone: { type: DataTypes.STRING },
});

const Basket = sequelize.define("basket", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketDevice = sequelize.define("basket_device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Brand = sequelize.define("brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Type = sequelize.define("type", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
});

const Model = sequelize.define("model", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  newPrice: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

const ModelInfo = sequelize.define("model_info", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  description: { type: DataTypes.STRING, allowNull: false },
  power: { type: DataTypes.INTEGER, allowNull: false },
  nicotine: { type: DataTypes.INTEGER, allowNull: false },
  countSmoke: { type: DataTypes.INTEGER, allowNull: false },
  charge: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Taste = sequelize.define("taste", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

const ModelTaste = sequelize.define("model_taste", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  photo: { type: DataTypes.STRING, allowNull: false },
  count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

const Device = sequelize.define("Device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});
const Orders = sequelize.define("orders", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  typeDelivery: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  post: { type: DataTypes.STRING },
});

Type.belongsToMany(Brand, { through: "TypeBrand" });
Brand.belongsToMany(Type, { through: "TypeBrand" });

Model.hasOne(ModelInfo, { foreignKey: "modelId", as: "model_info" });
ModelInfo.belongsTo(Model, { foreignKey: "modelId" });;

// Определение ассоциаций
Model.belongsToMany(Taste, {
  through: ModelTaste,
  as: 'tastes',
  foreignKey: 'modelId',
  otherKey: 'tasteId',
});
Taste.belongsToMany(Model, {
  through: ModelTaste,
  as: 'models',
  foreignKey: 'tasteId',
  otherKey: 'modelId',
});

// Дополнительные поля для связи
ModelTaste.belongsTo(Model);
ModelTaste.belongsTo(Taste);

// Создание связи с уникальной фотографией для каждого вкуса в модели
Model.hasMany(ModelTaste);
Taste.hasMany(ModelTaste);

Device.belongsTo(Type, { foreignKey: 'typeId' });
Device.belongsTo(Brand, { foreignKey: 'brandId' });
Device.belongsTo(Model, { foreignKey: 'modelId' });




User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Orders.hasMany(User);
User.belongsTo(Orders);

module.exports = {
  User,
  Admin,
  Basket,
  BasketDevice,
  Model,
  Taste,
  Device,
  Type,
  Brand,
  ModelTaste,
  ModelInfo,
};
