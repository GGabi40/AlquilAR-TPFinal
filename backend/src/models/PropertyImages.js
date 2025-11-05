import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PropertyImages = sequelize.define("PropertyImages", {
    propertyImagesId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    URLImages: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alt: {
        type: DataTypes.STRING,
        allowNull: false
    }
});
