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
  count: { type: DataTypes.INTEGER, allowNull: false },
});


const Device = sequelize.define("device", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, allowNull: false },
  count: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Orders = sequelize.define("orders", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  typeDelivery: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  post: { type: DataTypes.STRING },
});

const TypeBrand = sequelize.define("type_brand", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const TypeModel = sequelize.define("type_model", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Banner = sequelize.define("banners", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING, allowNull: false },
  priority: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
});

User.hasOne(Basket);
Basket.belongsTo(User);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

Brand.hasMany(Type);
Type.belongsTo(Brand);

Type.hasMany(Model);
Model.belongsTo(Type);

Model.hasMany(Taste);
Taste.belongsTo(Model);

Brand.hasMany(Model);
Model.belongsTo(Brand);


Model.hasMany(ModelInfo, { as: "info" });
ModelInfo.belongsTo(Model);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Type.hasMany(Device);
Device.belongsTo(Type);

Model.hasMany(Device);
Device.belongsTo(Model);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Orders.hasMany(User);
User.belongsTo(Orders);

Brand.belongsToMany(Type, { through: TypeBrand });
Type.belongsToMany(Brand, { through: TypeBrand });

Type.belongsToMany(Model, { through: TypeModel });
Model.belongsToMany(Type, { through: TypeModel });

module.exports = {
  User,
  Admin,
  Basket,
  BasketDevice,
  Brand,
  Type,
  Model,
  ModelInfo,
  Taste,
  Orders,
  Device,
  Banner,
};
