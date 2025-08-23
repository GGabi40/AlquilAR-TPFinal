import { Sequelize } from 'sequelize';

export const port = 3000;

export const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: "./database/database.db"
});
