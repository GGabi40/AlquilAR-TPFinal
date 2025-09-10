import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./User.js";

export const Property = sequelize.define("Property", {
    ubicacion: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    ambientes: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    banos: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    descripcion: {
        type: DataTypes.TEXT,
    },
    alquiler: {
        type: DataTypes.FLOAT,
        allowNull:false,
    },
    expensas: {
        type:DataTypes.FLOAT,
        allowNull:true,
    },
});

User.hasMany(Property, { foreignKey: "ownerId" });
Property.belongsTo(User, { foreignKey: "ownerId" });