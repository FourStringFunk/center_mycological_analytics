/**
 * Courses Model - .
 *
 * @module models/Courses
 */
const sequelize = require('../config/connection');
const {Model, DataTypes} = require('sequelize')
class Courses extends Model{

  // static functions go here

}
Courses.init( {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    course_code:{
      type: DataTypes.STRING(25),
      allowNull: false,
    },
    course_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    course_description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    course_location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    course_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'Courses',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
    ]
  });

  module.exports = Courses;
