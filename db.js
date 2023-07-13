const { Sequelize } = require("sequelize");
const pg = require("pg");

module.exports = new Sequelize(
    // process.env.POSTGRES_URL+"?sslmode=require",{dialectModule: pg}
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      dialect: "postgres",
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    }
  
//   {
//     ,
    // host:process.env.DB_HOST,
    // port: process.env.DB_PORT,
);
