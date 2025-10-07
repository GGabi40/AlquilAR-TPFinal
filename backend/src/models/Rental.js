import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Rental = sequelize.define("Rental", {
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.FLOAT
    },
    status: {
        type: DataTypes.ENUM("pending", "active", "finished"),
        defaultValue: "pending"
    }
});
