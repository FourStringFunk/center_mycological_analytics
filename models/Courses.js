/**
 * Comment Model - Represents a comment in the tech_blog database.
 *
 * @module models/Courses
 */
const Sequelize = require('sequelize');
const {Model, DataTypes} = require('sequelize')
class Courses extends Model{

  // static functions go here

}
  Comment.init( {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    course_name: {
      type: DataTypes.STRING(255),
      allowNull: false
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
    completion_status: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    certificate_awarded: {
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
      defaultValue: 0
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
