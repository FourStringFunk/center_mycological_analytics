/**
 * Student/Courses Model - A table to join on.
 *
 * @module models/StudentCourses
 */
const sequelize = require('../config/dbconnection');
const {Model, DataTypes} = require('sequelize')
class StudentCourses extends Model{

  // static functions go here

}
StudentCourses.init( {
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Students',
        key: 'id'
      }
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Courses',
        key: 'id'
      }
    }
  }, {
    sequelize,
    tableName: 'StudentCourses',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "student_id" },
          { name: "course_id" },
        ]
      },
      {
        name: "course_id",
        using: "BTREE",
        fields: [
          { name: "course_id" },
        ]
      },
    ]
  });
module.exports = StudentCourses;
