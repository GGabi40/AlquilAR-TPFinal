import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Property } from "./Property.js";

export const PropertyDocuments = sequelize.define("PropertyDocuments", {
    idDocumento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    URLDocumento: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

PropertyDocuments.belongsTo(Property, { foreignKey: "idPropiedad"});
Property.hasMany(PropertyDocuments, { foreignKey: "idPropiedad"});