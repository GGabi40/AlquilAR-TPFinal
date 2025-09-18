import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Favorite = sequelize.define("Favorite", {
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
}, {
    tableName: "favorites",
    timestamps: false,
});

export default Favorite;