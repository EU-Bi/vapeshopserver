const uuid = require("uuid");
const path = require("path");
const { Banner } = require("../models/models");
const ApiError = require("../error/ApiError");

class BannerController {
  async create(req, res, next) {
    try {
      let { priority } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + ".jpg";
      img.mv(path.resolve(__dirname, "..", "banners", fileName));
      const banner = await Banner.create({
        priority,
        img: fileName,
      });
      return res.json(banner);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
  async getAll(req, res) {
    const banners = await Banner.findAll();
    return res.json(banners);
  }
  async getOne(req, res) {
    const { id } = req.params;
    const banners = await Banner.findOne({ where: { id } });
    return res.json(banners);
  }
}

module.exports = new BannerController();
