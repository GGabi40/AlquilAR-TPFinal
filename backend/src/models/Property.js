import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import { User } from "./User.js";

export const Property = sequelize.define("Property", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    rent: {
        type: DataTypes.FLOAT,
        allowNull:false,
    },
    location: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    rooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bathrooms: {
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    expenses: {
        type:DataTypes.FLOAT,
        allowNull:true,
    },
    featured: {
        type:DataTypes.BOOLEAN,
        defaultValue: false,
    },
});

User.hasMany(Property, { foreignKey: "ownerId" });
Property.belongsTo(User, { foreignKey: "ownerId" });