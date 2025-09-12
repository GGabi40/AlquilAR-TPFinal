import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

export const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    surname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    cellphone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    isActive: {
        type: DataTypes.ENUM(true, false),
        allowNull: false,
        defaultValue: true
    },
    role: {
        type: DataTypes.ENUM('superadmin', 'owner', 'user'),
        allowNull: false
    }
});