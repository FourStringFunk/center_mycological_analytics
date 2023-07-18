var DataTypes = require("sequelize").DataTypes;
var _Courses = require("./Courses");
var _Finance = require("./Finance");
var _StudentCourses = require("./StudentCourses");
var _Students = require("./Students");

function initModels(sequelize) {
  var Courses = _Courses(sequelize, DataTypes);
  var Finance = _Finance(sequelize, DataTypes);
  var StudentCourses = _StudentCourses(sequelize, DataTypes);
  var Students = _Students(sequelize, DataTypes);

  Courses.belongsToMany(Students, { as: 'student_id_Students', through: StudentCourses, foreignKey: "course_id", otherKey: "student_id" });
  Students.belongsToMany(Courses, { as: 'course_id_Courses', through: StudentCourses, foreignKey: "student_id", otherKey: "course_id" });
  StudentCourses.belongsTo(Courses, { as: "course", foreignKey: "course_id"});
  Courses.hasMany(StudentCourses, { as: "StudentCourses", foreignKey: "course_id"});
  Finance.belongsTo(Students, { as: "student", foreignKey: "student_id"});
  Students.hasMany(Finance, { as: "Finances", foreignKey: "student_id"});
  StudentCourses.belongsTo(Students, { as: "student", foreignKey: "student_id"});
  Students.hasMany(StudentCourses, { as: "StudentCourses", foreignKey: "student_id"});

  return {
    Courses,
    Finance,
    StudentCourses,
    Students,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
