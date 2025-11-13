import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Post = sequelize.define("Post", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM("active", "paused", "rented"),
    allowNull: false,
    defaultValue: "active",
  },
  ownerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
