import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const PropertyDocuments = sequelize.define("PropertyDocuments", {
    documentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    URLDocument: {
        type: DataTypes.STRING,
        allowNull: false
    },
    propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Properties",
      key: "idProperty",
    },
    onDelete: "CASCADE",
  },
});
