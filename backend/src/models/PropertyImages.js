import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { PropertyDetails } from "./PropertyDetails.js";

export const PropertyImages = sequelize.define("PropertyImages", {
    idFotoPropiedad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    URLFoto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    alt: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

PropertyDetails.hasMany(PropertyImages, { foreignKey: "idPropiedadDetalle"});
PropertyImages.belongsTo(PropertyDetails, { foreignKey: "idPropiedadDetalle"});