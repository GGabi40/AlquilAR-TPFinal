import { DataTypes } from "sequelize";
import { sequelize } from "../../src/config/db.js";

export const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.ENUM('superadmin', 'owner', 'user'),
        allowNull: false
    }
});