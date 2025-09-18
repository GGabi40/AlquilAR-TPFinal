import { Datatypes } from "sequelize";
import { sequelize } from "../config/db.js";

const Favorite = sequelize.define("Favorite", {
    id: {
        type: Datatypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
    },
    property_id: {
        type: Datatypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "favorites",
    timestamps: false,
});

export default Favorite;