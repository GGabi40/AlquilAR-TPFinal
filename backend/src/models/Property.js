import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Property = sequelize.define("Property", {
    idProperty: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    propertyType:{
        type: DataTypes.ENUM('departamento', 'casa'),
        defaultValue: 'departamento',
        allowNull: false
    },
    rentPrice: {
        type: DataTypes.FLOAT,
        allowNull:false,
    },
    expensesPrice: {
        type:DataTypes.FLOAT,
        allowNull:true,
    },
    status: {
        type: DataTypes.ENUM('disponible', 'no disponible', 'en revision'),
        defaultValue: 'disponible',
        allowNull: false
    },
    rentPreference:{
        type: DataTypes.ENUM('alquiler temporal', 'alquiler completo'),
        defaultValue: 'alquiler completo',
        allowNull: false
    },
    address: {
        type:DataTypes.STRING,
        allowNull: false,
    }
});
