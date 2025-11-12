import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: process.env.DB_PATH
});

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Conexión a la base de datos establecida.");

    await sequelize.query("PRAGMA journal_mode = WAL;");
    await sequelize.query("PRAGMA busy_timeout = 60000;");
    console.log("Configuración WAL y timeout aplicada.");

  } catch (error) {
    console.error("Error al conectar o configurar SQLite:", error);
  }
};