import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Property = sequelize.define("Property", {
    idProperty: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    propertyType:{
        type: DataTypes.ENUM('departamento', 'casa'),
        defaultValue: 'departamento',
        allowNull: false
    },
    rentPrice: {
        type: DataTypes.FLOAT,
        allowNull:false,
    },
    expensesPrice: {
        type:DataTypes.FLOAT,
        allowNull:true,
    },
    status: {
        type: DataTypes.ENUM('available', 'unavailable', 'pending', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
    },
    rentPreference:{
        type: DataTypes.ENUM('temporal', 'complete'),
        defaultValue: 'complete',
        allowNull: false
    },
    address: {
        type:DataTypes.STRING,
        allowNull: false,
    },
    ownerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    localityId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "PropertyLocalities",
      key: "localityId",
    },
  },
  provinceId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "PropertyProvinces",
      key: "provinceId",
    },
  },
});
