import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PropertyDetails = sequelize.define('PropertyDetails', {
    idPropertyDetails: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numRooms: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    numBedrooms: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    numBathrooms: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    propertyAge: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    totalArea:{
        type: DataTypes.FLOAT,
        allowNull: false
    }
});
