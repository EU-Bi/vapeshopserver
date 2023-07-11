const ApiError = require("../error/ApiError");
const { Admin } = require("../models/models");
const bcrypt = require("bcryptjs");
const jwToken = require("jsonwebtoken");

const generateJWT = (id, login) => {
  return jwToken.sign({ id, login }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class AdminController {
  async registration(req, res, next) {
    const { login, password } = req.body;
    if (!login || !password) {
      next(ApiError.badRequest("Некорректный login или password "));
    }
    const candidate = await Admin.findOne({ where: { login } });
    if (candidate) {
      return next(
        ApiError.badRequest("Пользователь с таким login уже существует!")
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const admin = Admin.create({ login, password: hashPassword });
    const token = generateJWT(admin.id, login);
    return res.json({ token });
  }
  async login(req, res, next) {
    const { login, password } = req.body;
    const admin = await Admin.findOne({ where: { login } });
    if(!admin){
        return next(
            ApiError.internal("Пользователь с таким login не найден!")
          );
    }
    let comparePassword = bcrypt.compareSync(password, admin.password)
    if(!comparePassword){
        return next(

            ApiError.internal("Не верный пароль!")
          );
    }
    const token = generateJWT(admin.id, admin.login)
    return res.json({token})
  }
  async check(req, res, next) {
    const token = generateJWT(req.admin.id, req.admin.login)
    return res.json({token})
  }
}

module.exports = new AdminController();
