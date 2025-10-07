import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PropertyProvince = sequelize.define("PropertyProvince", {
    idProvince: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nameP: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
