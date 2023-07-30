/**
 * Retrieve student data from the user model
 */

const { Students, StudentCourses, Courses } = require('../models')

const { ValidationError } = require('sequelize');


async function getProfile(sessionId) {
    
    if(!sessionId){
        throw new ValidationError("No session id")
    }

    let studentData = await Students.findOne({where: {id : sessionId}})

    let studentObject = {};
    let courseObjects = [];

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

        let studentCourses = await StudentCourses.findAll({
            where: {student_id : studentData.id},
            include: [
                {
                  model: Courses,
                },
              ],
        });

        courseObjects = studentCourses.map((studentCourse) => {
            //'Course' string corresponds to the model's name that the StudentCourse belongs to. 
            // It should match the case (upper or lower) of the model's name.
            const course = studentCourse.get('Course');
            return {
                id: course.id,
                course_code: course.course_code,
                course_name: course.course_name,
                course_location: course.course_location,
                // add other course fields as needed
                certificate_awarded: studentCourse.certificate_awarded,
                completion_status: studentCourse.completion_status,
            };
        });
    }

    const profileData = {
        student: studentObject,
        studentCourses: courseObjects
    };
    
    return profileData;
}

module.exports = getProfile;