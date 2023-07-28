/**
 * Setup server & Routes
 */
const express = require('express');                                     // Import the Express module
require('dotenv').config();
const routes = require('./controllers');                                // Import the routes from the controllers file
const sequelize = require('./config/connection.js');                  // Import the Sequelize instance from the dbconnection.js file
const app = express();                                                  // Create an instance of the Express application
const PORT = process.env.PORT || 3001;                                  // Define the port for the server to listen on
const exphbs = require('express-handlebars');                           // Import the Express Handlebars module
const session = require('express-session');                             // used for session cookies
const path = require('path');   
const helpers = require('./utils/helpers');                                        // Import the path module      
//const SequelizeStore = require('connect-session-sequelize')(session.save)
var cookieParser = require('cookie-parser')
const { Op } = require('sequelize');
const { connect } = require('http2');
const { Courses, Students, Session, StudentCourses } = require('./models');

const hbs = exphbs.create({                                             // Create an instance of Express Handlebars with helpers and default layout
    helpers: helpers,
    defaultLayout: 'main' 
});        
               

app.engine('handlebars', hbs.engine);                            // Set the handlebars engine for rendering views
app.set('view engine', 'handlebars');

app.use(cookieParser())
app.use(express.json());                                         // Parse JSON bodies sent in requests

// sets up your cookies
app.use(session({
    secret: process.env.SECRET,                                 // the secret helps with hashing the session cookie I think?
    resave: false,                                              // set resave to false to prevent potentially problematic race conditions.
    saveUninitialized: false,
    cookie: { 
        secure: false,                                          // `true` for HTTPS, `false` for HTTP
        httpOnly: true,                                         // Blocks client-side JavaScript from accessing the cookie
        maxAge:  3600000,                                       // The duration in milliseconds for which the cookie is valid
        sameSite: false,
        proxy: false                                            //Trust the reverse proxy when setting secure cookies (via the "X-Forwarded-Proto" header).
    }
}));

app.use(express.urlencoded({ extended: true }));                // Parse URL-encoded bodies sent in requests
app.use(express.static(path.join(__dirname, 'public')));        // Serve static files from the 'public' directory
app.use(routes); // Use the defined routes

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await Courses.sync();
        await Students.sync();
        await Session.sync();
        await StudentCourses.sync();
        
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

        setInterval(async () => {
            try {
                // Every 2 minutes, this will run and delete any sessions that are 1 minute old
                // this function will execute every 2 minutes, 
              const cutoff = new Date(Date.now() - (1 * 60 * 1000));     //  deletes sessions 1 minute past expiry time,
              await Session.clearExpiredSessions(cutoff);                
            } catch (err) {
              console.error('Error in handling sessions: ', err);
            }
          }, 2 * 60 * 1000);            

    } catch (err) {
        console.error('Unable to connect to the database:', err);
    }
}
startServer();

// alrenative format
// sequelize.authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .then(() => Courses.sync())
//   .then(() => Students.sync())
//   .then(() => Sessions.sync())
//   .then(() => StudentCourses.sync())
//   .then(() => {
//     app.listen(PORT, () => console.log('Server Listening!')); 
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });