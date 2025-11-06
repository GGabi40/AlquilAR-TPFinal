import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PropertyLocality = sequelize.define("PropertyLocality", {
    localityId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
