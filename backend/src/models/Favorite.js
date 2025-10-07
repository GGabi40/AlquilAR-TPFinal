import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Favorite = sequelize.define("Favorite", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    propertyId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "favorites",
    timestamps: false,
});
