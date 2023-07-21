/**
 * Retrieve student data from the user model
 */

const Student = require('../models/Students')
const StudentCourse = require('../models/StudentCourses')
const { ValidationError } = require('sequelize');


async function getProfile(sessionId) {
    let studentId = sessionId
    if(!studentId){
        throw new ValidationError("No session id")
    }

    let studentArray = [];
    let courseData = [];

    let studentData = await Student.findOne({where: {id : studentId}})

    if (studentData) {
        studentData = studentData.dataValues;
        studentArray.push(
            studentData.id,
            studentData.email,
            studentData.enrollment_status,
            studentData.first_name,
            studentData.last_name,
            studentData.address_1,
            studentData.address_2,
            studentData.city,
            studentData.state,
            studentData.zip,
            studentData.deleted
        );

        let sc = await StudentCourse.findOne({where: {student_id : studentData.id}})
        if (sc) {
            courseData.push(
                sc.student_id,
                sc.course_id,
                sc.certificate_awarded,
                sc.completion_status
            );
        }
    }
    const profileData = {
        student: studentArray,
        studentCourses: courseData
      };
    
      return profileData;
}

module.exports = getProfile;
