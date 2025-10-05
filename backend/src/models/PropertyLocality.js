import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Property } from "./Property.js";

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

PropertyLocality.belongsTo(Property, { foreignKey: "idPropiedad" });
Property.hasOne(PropertyLocality, { foreignKey: "idPropiedad" });