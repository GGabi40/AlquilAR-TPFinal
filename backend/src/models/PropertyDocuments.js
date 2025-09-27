import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Property } from "./Property.js";

export const PropertyDocuments = sequelize.define("PropertyDocuments", {
    idDocument: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    URLDocument: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

PropertyDocuments.belongsTo(Property, { foreignKey: "idPropiedad"});
Property.hasMany(PropertyDocuments, { foreignKey: "idPropiedad"});