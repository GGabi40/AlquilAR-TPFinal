import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { User } from "./User.js";

export const Property = sequelize.define("Property", {
    idPropiedad: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipoPropiedad:{
        type: DataTypes.ENUM('departamento', 'casa'),
        defaultValue: 'departamento',
        allowNull: false
    },
    precioAlquiler: {
        type: DataTypes.FLOAT,
        allowNull:false,
    },
    precioExpensas: {
        type:DataTypes.FLOAT,
        allowNull:true,
    },
    estado: {
        type: DataTypes.ENUM('disponible', 'no disponible', 'en revision'),
        defaultValue: 'disponible',
        allowNull: false
    },
    preferenciaAlquiler:{
        type: DataTypes.ENUM('alquiler temporal', 'alquiler completo'),
        defaultValue: 'alquiler completo',
        allowNull: false
    },
    direccion: {
        type:DataTypes.STRING,
        allowNull: false,
    }
});

User.hasMany(Property, { foreignKey: "ownerId" });
Property.belongsTo(User, { foreignKey: "ownerId" });