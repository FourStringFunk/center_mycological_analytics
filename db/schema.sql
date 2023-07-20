DROP DATABASE IF EXISTS C_M_A;
CREATE DATABASE C_M_A;
USE C_M_A;

-- CREATE TABLE Students (
--   id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY UNIQUE,
--   email VARCHAR(40) NOT NULL UNIQUE,
--   password VARCHAR(255) NOT NULL,
--   enrollment_status VARCHAR(15),
--   first_name VARCHAR(40) NOT NULL,
--   last_name VARCHAR(40) NOT NULL,
--   address_1 VARCHAR(100) NOT NULL,
--   address_2 VARCHAR(100),
--   city VARCHAR(40) NOT NULL,
--   state VARCHAR(20) NOT NULL,
--   country VARCHAR(30) NOT NULL,
--   zip INTEGER NOT NULL,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--   deleted BOOLEAN NOT NULL DEFAULT FALSE
-- );

-- CREATE TABLE Finance (
--   id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
--   student_id INTEGER NOT NULL,
--   account_status VARCHAR(255) NOT NULL,
--   payment_term INTEGER,
--   employer_name VARCHAR(255),
--   employment_status BOOLEAN NOT NULL,
--   payment_plan BOOLEAN,
--   payment_amount INTEGER,
--   deleted BOOLEAN NOT NULL DEFAULT FALSE,
--   FOREIGN KEY (student_id) REFERENCES Students(id)
-- );

-- CREATE TABLE Courses (
--   id INTEGER AUTO_INCREMENT PRIMARY KEY NOT NULL,
--   course_name VARCHAR(255) NOT NULL,
--   start_date TIMESTAMP NOT NULL,
--   end_date TIMESTAMP NOT NULL,
--   start_time TIME NOT NULL,
--   end_time TIME NOT NULL,
--   course_active BOOLEAN,
--   completion_status VARCHAR(200),
--   certificate_awarded BOOLEAN,
--   cost INTEGER,
--   deleted BOOLEAN NOT NULL DEFAULT FALSE
-- );

-- CREATE TABLE StudentCourses (
--   student_id INTEGER NOT NULL,
--   course_id INTEGER NOT NULL,
--   FOREIGN KEY (student_id) REFERENCES Students(id),
--   FOREIGN KEY (course_id) REFERENCES Courses(id),
--   PRIMARY KEY (student_id, course_id)
-- );

-- CREATE TABLE  Sessions (
--   id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
--   user_id INTEGER NOT NULL UNIQUE,
--   session_token VARCHAR(255) NOT NULL UNIQUE,
--   expires_at DATE,
--   active BOOLEAN NOT NULL DEFAULT false,
--   minutes_active` INTEGER,
--   createdAt DATETIME NOT NULL,
--   updatedAt DATETIME NOT NULL,
--   FOREIGN KEY (user_id) REFERENCES Students(id)
--   );



