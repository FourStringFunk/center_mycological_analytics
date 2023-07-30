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
const Session = require('./Session');


Courses.belongsToMany(Students, { 
  through: StudentCourses, 
  foreignKey: "course_id", 
  otherKey: "student_id" 
});

Students.belongsToMany(Courses, { 
  through: StudentCourses, 
  foreignKey: "student_id", 
  otherKey: "course_id" 
});

StudentCourses.belongsTo(Courses, { 
  foreignKey: "course_id"
});

StudentCourses.belongsTo(Students, { 
  foreignKey: "student_id"
});

Finance.belongsTo(Students, { 
  foreignKey: "student_id"
});

Students.hasMany(Finance, { 
  foreignKey: "student_id"
});

Courses.hasMany(StudentCourses, { 
  foreignKey: "course_id"
});

Students.hasMany(StudentCourses, { 
  foreignKey: "student_id"
});

Session.belongsTo(Students, {
  foreignKey: 'user_id'
});

  module.exports = {
    Courses,
    Finance,
    StudentCourses,
    Students,
    Session
  };
