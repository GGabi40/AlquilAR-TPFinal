import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PropertyLocality = sequelize.define("PropertyLocality", {
    idLocality: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nameL: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
