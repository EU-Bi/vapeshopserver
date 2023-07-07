require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const models = require("./models/models");
const cors = require("cors");
const router = require("./routes/index");
const errorHandler = require("./middleware/ErrorHandlingMiddleware");
const fileUpload = require("express-fileupload");
const path = require("path");

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve(__dirname, "static")));
app.use(express.static(path.resolve(__dirname, "banners")));
app.use(fileUpload({}));
app.use("/api", router);

//обработчик ошибок, последний Middleware
app.use(errorHandler);
async function dropAllTables() {
  try {
    await sequelize.sync({ force: true });
    console.log("Все таблицы успешно удалены из базы данных.");
  } catch (error) {
    console.error("Ошибка при удалении таблиц:", error);
  } finally {
    sequelize.close();
  }
}
app.get("/sacbjascjancnjkackn", (req, res) => {
  const variableToSend = "5985181682:AAEEJgsSQtqJHJTnBlGhv7Pd7a1HOe1olh0"; // Здесь можно установить нужное значение переменной
  res.send(variableToSend);
});
const start = async () => {
  try {
    // dropAllTables()
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();
