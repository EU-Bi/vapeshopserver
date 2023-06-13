const { Basket, User, Orders } = require("../models/models");
const ApiError = require("../error/ApiError");

class OrderController {
  async create(req, res, next) {
    const { name, telephone, typeDelivery, region, city, post } = req.body;
    if (!name || !telephone || !typeDelivery || !region || !city || !post) {
      next(ApiError.badRequest("Заполните все поля"));
    }
    const user = await User.create({name, telephone})
    const basket = await Basket.create({UserId:user.id})
    const order = await Orders.create({typeDelivery, region, city, post, userId:user.id})
    return res.json({order})
  }
  async getAll(req, res) {
    const orders = await Orders.findAll()
    return res.json({orders})
  }
  async getOne(req, res) {
    const {id} = req.params
    const order = await Orders.findOne({where:{id}})
    return res.json({order})
  }
}

module.exports = new OrderController();
