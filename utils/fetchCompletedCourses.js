/**
 * Fetch list of completed courses
 */
const Student = require('../models/Students')

async function fetchCourses(studentId) {
    const completedCoursesString = await Student.getCompletedCourses(studentId)
    // the student model returns a string of items separated by commas,
    // here we are turning them into an array using split.
    const completedCoursesArray = completedCoursesString.split(',');
    return completedCoursesArray;
}

module.exports = fetchCourses;