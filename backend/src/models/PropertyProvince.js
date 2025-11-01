import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PropertyProvince = sequelize.define("PropertyProvince", {
    idProvince: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
