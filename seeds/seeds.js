// seeds.js

const sequelize = require('../config/connection');
const { Students, Courses, Finance, StudentCourses } = require('../models');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const studentsData = [
    {
      id: 1,
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
      id: 2,
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
      id: 1,
      course_name: "Course 1",
      start_date: "2023-09-01",
      end_date: "2023-12-01",
      start_time: "09:00:00",
      end_time: "10:30:00",
      course_active: true,
      cost: 1000,
      deleted: false
    },
    {
      id: 2,
      course_name: "Course 2",
      start_date: "2023-09-01",
      end_date: "2023-12-01",
      start_time: "11:00:00",
      end_time: "12:30:00",
      course_active: true,
      cost: 1200,
      deleted: false
    }
  ];

  const financeData = [
    {
      id: 1,
      student_id: 1,
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
      student_id: 2,
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
      student_id: 1,
      course_id: 1,
      certificate_awarded: false,
      completion_status: "ongoing"
    },
    {
      student_id: 2,
      course_id: 2,
      certificate_awarded: false,
      completion_status: "ongoing"
    }
  ];

  await Students.bulkCreate(studentsData, {
    individualHooks: true,
    returning: true,
  });

  await Courses.bulkCreate(coursesData);

  await Finance.bulkCreate(financeData);

  await StudentCourses.bulkCreate(studentCoursesData);

  process.exit(0);
};

seedDatabase();
