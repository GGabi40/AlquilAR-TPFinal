import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { PropertyDetails } from "./PropertyDetails.js";

export const PropertyVideos = sequelize.define("PropertyVideos", {
    idPropiedadVideo: {
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

PropertyDetails.hasMany(PropertyVideos, { foreignKey: "idPropiedadDetalle" });
PropertyVideos.belongsTo(PropertyDetails, { foreignKey: "idPropiedadDetalle" });