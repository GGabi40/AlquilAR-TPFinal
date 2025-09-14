import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import { Property } from "./Property.js";

export const PropertyDetails = sequelize.define('PropertyDetails', {
    idPropiedadDetalle: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numAmbientes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numHabitaciones: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    numBanios: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    antiguedad: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    metrosTotales:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
});

//ver si esta bien hecha 
Property.hasOne(PropertyDetails, { foreignKey: "idPropiedad"});
PropertyDetails.belongsTo(Property, { foreignKey: "idPropiedad"});