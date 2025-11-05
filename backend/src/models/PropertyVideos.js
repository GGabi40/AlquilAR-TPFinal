import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PropertyVideos = sequelize.define("PropertyVideos", {
    propertyVideoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    URLVideo: {
        type: DataTypes.STRING,
        allowNull: true
    },
    alt: {
        type: DataTypes.STRING,
        allowNull: true
    }
});
