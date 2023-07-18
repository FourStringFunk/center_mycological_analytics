/**
 * Associations - Establishes the associations between the  models.
 * 
 *
 * @module models/Associations
 */


const Courses = require("./Courses");
const Finance = require("./Finance");
const StudentCourses = require("./StudentCourses");
const Students = require("./Students");



  Courses.belongsToMany(Students, { as: 'student_id_Students', through: StudentCourses, foreignKey: "course_id", otherKey: "student_id" });

  Students.belongsToMany(Courses, { as: 'course_id_Courses', through: StudentCourses, foreignKey: "student_id", otherKey: "course_id" });
  
  StudentCourses.belongsTo(Courses, { as: "course", foreignKey: "course_id"});
  
  StudentCourses.belongsTo(Students, { as: "student", foreignKey: "student_id"});

  Finance.belongsTo(Students, { as: "student", foreignKey: "student_id"});

  Students.hasMany(Finance, { as: "Finances", foreignKey: "student_id"});

  Courses.hasMany(StudentCourses, { as: "StudentCourses", foreignKey: "course_id"});
  
  Students.hasMany(StudentCourses, { as: "StudentCourses", foreignKey: "student_id"});

  module.exports = {
    Courses,
    Finance,
    StudentCourses,
    Students,
  };
