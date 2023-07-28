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

    let studentData = await Student.findOne({where: {id : studentId}})

    let studentObject = {};
    let courseObject = {};

    if (studentData) {
        studentData = studentData.dataValues;
        studentObject = {
            id: studentData.id,
            email: studentData.email,
            enrollment_status: studentData.enrollment_status,
            first_name: studentData.first_name,
            last_name: studentData.last_name,
            address_1: studentData.address_1,
            address_2: studentData.address_2,
            city: studentData.city,
            state: studentData.state,
            zip: studentData.zip,
            deleted: studentData.deleted
        };

        let sc = await StudentCourse.findOne({where: {student_id : studentData.id}})
        if (sc) {
            courseObject = {
                student_id: sc.student_id,
                course_name: sc.course_name,
                course_id: sc.course_id,
                certificate_awarded: sc.certificate_awarded,
                completion_status: sc.completion_status
            };
        }
    }
    const profileData = {
        student: studentObject,
        studentCourses: courseObject
      };
    
      return profileData;
}

module.exports = getProfile;