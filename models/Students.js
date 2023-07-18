/**
 * Students Model - .
 *
 * @module models/Students
 */
const sequelize = require('../config/dbconnection');
const {Model, DataTypes} = require('sequelize')
class Students extends Model{

  // static functions go here

}
Students.init( {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING(40),
      allowNull: false,
      unique: "email"
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    enrollment_status: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    first_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    address_1: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    address_2: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    city: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    country: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    zip: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'Students',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "email",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "email" },
        ]
      },
    ]
  });
module.exports = Students;