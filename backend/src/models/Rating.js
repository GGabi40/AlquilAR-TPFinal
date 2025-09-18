import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Rating = sequelize.define("Rating", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    property_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    stars: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1, max: 5 }
    },
}, {
    tableName: "ratings",
    timestamps: false,
});

export default Rating;