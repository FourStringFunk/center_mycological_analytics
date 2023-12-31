// seeds.js

const sequelize = require('../config/connection');
const { Students, Courses, Finance, StudentCourses } = require('../models');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const studentsData = [
    {
      id: "1r2edf",
      email: "student1@example.com",
      password_hash: "password1",
      enrollment_status: "enrolled",
      first_name: "John",
      last_name: "Doe",
      address_1: "123 Any Street",
      address_2: "",
      city: "Anytown",
      state: "Anystate",
      country: "Anycountry",
      zip: 12345,
      deleted: false
    },
    {
      id: "3rsd25",
      email: "student2@example.com",
      password_hash: "password2",
      enrollment_status: "enrolled",
      first_name: "Jane",
      last_name: "Doe",
      address_1: "456 Any Street",
      address_2: "Apt 789",
      city: "Anytown",
      state: "Anystate",
      country: "Anycountry",
      zip: 12345,
      deleted: false
    }
  ];

  const coursesData = [
    {
      id: 1001,
      course_code: "CMAS",
      course_name: "Mushroom Extraction and Analysis",
      course_description: "This summer we are offering a 45-seat course over three 3-day, in-person trainings! Our goal is to bring together our community of citizen scientists and researchers to provide you all the opportunity to learn from our work and insights, and then offer space for you to become a part of it with us!",
      course_location: "online",
      start_date: "2023-09-01",
      end_date: "2023-12-01",
      start_time: "09:00:00",
      end_time: "10:30:00",
      course_active: true,
      cost: 1000,
      deleted: false
    },
    {
      id: 1002,
      course_code: "CMAS",
      course_name: "Mushroom Chemical Structures & Compounds",
      course_description: "This summer we are offering a 30-seat course over three 3-day, in-person trainings! Our goal is to bring together our community of citizen scientists and researchers to provide you all the opportunity to learn from our work and insights, and then offer space for you to become a part of it with us!",
      course_location: "online",
      start_date: "2023-09-01",
      end_date: "2023-12-01",
      start_time: "09:00:00",
      end_time: "10:30:00",
      course_active: true,
      cost: 1000,
      deleted: false
    },
    {
      id: 1003,
      course_code: "CMAS",
      course_name: "Psyhoactive chemicle state analysis",
      course_description: "This summer we are offering a 25-seat course over three 3-day, in-person trainings! Our goal is to bring together our community of citizen scientists and researchers to provide you all the opportunity to learn from our work and insights, and then offer space for you to become a part of it with us!",
      course_location: "in-person",
      start_date: "2023-09-01",
      end_date: "2023-12-01",
      start_time: "11:00:00",
      end_time: "12:30:00",
      course_active: true,
      cost: 1200,
      deleted: false
    },
  ];

  const financeData = [
    {
      id: 1,
      student_id: "1r2edf",
      account_status: "active",
      payment_term: 30,
      employer_name: "Company 1",
      employment_status: true,
      payment_plan: true,
      payment_amount: 500,
      deleted: false,
      last_payment: "2023-07-01"
    },
    {
      id: 2,
      student_id: "3rsd25",
      account_status: "active",
      payment_term: 30,
      employer_name: "Company 2",
      employment_status: true,
      payment_plan: true,
      payment_amount: 600,
      deleted: false,
      last_payment: "2023-07-01"
    }
  ];

  const studentCoursesData = [
    {
      student_id: "1r2edf",
      course_id: 1001,
      certificate_awarded: false,
      completion_status: "In-progress"
    },
    {
      student_id: "1r2edf",
      course_id: 1003,
      certificate_awarded: false,
      completion_status: "In-progress"
    },
    {
      student_id: "3rsd25",
      course_id: 1001,
      certificate_awarded: false,
      completion_status: "In-progress"
    },
    {
      student_id: "3rsd25",
      course_id: 1002,
      certificate_awarded: false,
      completion_status: "Not-Started"
    },
    {
      student_id: "3rsd25",
      course_id: 1003,
      certificate_awarded: true,
      completion_status: "Completed"
    }
  ];

  const studentCoursesDataWithCourseName = studentCoursesData.map(studentCourse => {
    const course = coursesData.find(course => course.id === studentCourse.course_id);
    if (!course) {
      throw new Error(`Course with id ${studentCourse.course_id} not found`);
    }
    return {
      ...studentCourse,
      course_name: course.course_name,
    };
  });

  await Students.bulkCreate(studentsData, {
    individualHooks: true,
    returning: true,
  });

  await Courses.bulkCreate(coursesData);

  await Finance.bulkCreate(financeData);

  await StudentCourses.bulkCreate(studentCoursesDataWithCourseName);

  process.exit(0);
};

seedDatabase();
