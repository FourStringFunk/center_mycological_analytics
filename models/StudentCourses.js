/**
 * Student/Courses Model - 
 *
 * @module models/StudentCourses
 */
const sequelize = require('../config/connection');
const {Model, DataTypes} = require('sequelize')
class StudentCourses extends Model{

  static async addStudentCourse(studentId, courseId, completionStatus, certificateAwarded){
    try {
        const newCourse = await this.create({
            student_id: studentId,
            course_id: courseId,
            certificate_awarded: certificateAwarded,
            completion_status: completionStatus,
        });
        return newCourse;
    } catch (err) {
        console.error(err);
        return null;
    }
}

static async updateStudentCourse(studentId, courseId, completionStatus, certificateAwarded){
    try {
        const updateCourse = await this.update({
            certificate_awarded: certificateAwarded,
            completion_status: completionStatus,
        }, {
            where: {
                student_id: studentId,
                course_id: courseId,
            }
        });
        return updateCourse;
    } catch (err) {
        console.error(err);
        return null;
    }
}

}
StudentCourses.init( {
    student_id: {
      type: DataTypes.STRING(50),
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
    },
    certificate_awarded: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    completion_status: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
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
