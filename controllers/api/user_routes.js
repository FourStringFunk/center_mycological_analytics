/**
 * User Routes.
 * @module /api/users
 */
require('dotenv').config();
const router = require('express').Router();
const Students = require('../../models/Students');
const Session = require('../../models/Session');
const uuid = require('uuid');
const sendEmail = require('../../utils/forgotPasswordEmail')
const { body, validationResult } = require('express-validator');
const checkAuth1 = require('../../utils/checkAuth')
const shortid = require('shortid');
/**
 * login page route serves the content
 * Endpoint: api/users/login
 */ 
router.get('/login', (req, res) => {
    try{
        res.status(200).render('login', { isLoginTemplate: true });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
/**
 * This route take data from the login page and is data is good, allows user to login
 * client side .js handles the redirect, because it sets the browser cookie on the client side
 * Endpoint: api/users/validate
 */ 
router.post('/validate', async (req, res) => {
    try{
        // find the user by email
        const userData = await Students.findOne({where:{email: req.body.email}})
        if(!userData){
            res.status(404).json({message: "User not found!"})
            return;
        }
     // uses the ckeckPassword function inside the USER model, returns true if it matches
     const validPassword = await userData.validatePassword(req.body.password);
     if (!validPassword) {
       res.status(400).json({message: "Incorrect email or password"});
       return;
     }
      let expiresAt = new Date();
     // Set the initial expiration time of the session for 30 minutes
      expiresAt.setMinutes(expiresAt.getMinutes() + 30); 
      const sessionToken = uuid.v4();
      // setting the seeeion in the database
      const newSession = await Session.create({
          user_id: userData.id,
          session_token: sessionToken,  // session IDs
          expires_at: expiresAt,
          active: true,
      });

     // sets the express-session as active
     req.session.save(() => {
        req.session.user_id = userData.id;
        req.session.logged_in = true;
        res.json({ user: userData, message: 'You are now logged in!' });
    });
      
     // set the users status to active in the database
     const userSession = await Session.findOne({where: { user_id: userData.id }})
     if (userSession) {
        userSession.active = true;
        await userSession.save();
    }
    // send back the newSession info to user
     res.status(201).json({ newSession });
    }catch(err){
        console.error({message: "Error in post route: ", Error: err})
        return res.status(500).json({message: 'Error session interrupted unexpectedly: Session will refresh in 30 min'})
    }
});
/**
 * This serves the 'create profile' page for the user to sign up
 * Endpoint: api/users/create
 */ 
router.get('/create', (req, res) => {
    try{
        res.status(200).render('createProfile', { isNewProfile: true });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
/**
 * new user route, checks the users email, creates a new student and session
 * Endpoint: api/users/create/newuser
 */
router.post('/create/newuser', async (req,res)=>{
    try{
        const duplicateData = await Students.findOne({where:{email: req.body.email}})
        if(duplicateData){
            res.status(409).json({message: "Email already exists."})
            return;
        }
        if(!req.body) {
            res.status(409).json({message: "You didnt send any data."})
            return
        } 
        // create a new student entry
        let studentData = await Students.create({
            id: shortid.generate(),
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password_hash: req.body.password,
        })
        if(!studentData){
            res.status(500).json({message: 'Failed to add new user to the student database'})
            return
        }
        let expiresAt = new Date();
        // Set the initial expiration time of the session for 30 minutes
        expiresAt.setMinutes(expiresAt.getMinutes() + 30); 
        const sessionToken = uuid.v4();
        // set the session in the database
        const newSession = await Session.create({
            user_id: studentData.id,
            session_token: sessionToken,  // session IDs
            expires_at: expiresAt,
            active: true,
        });
        console.log('New session: ', newSession)
        // set the session on req session
        req.session.save(() => {
            req.session.user_id = studentData.id;
            req.session.logged_in = true;
        });
        setTimeout(() => {res.status(200).redirect('/api/proile')}, 500)
    }
    catch(err){
        console.error({message: "Error in post route: ", Error: err})
        res.status(400).json({message: "Bad request, no data recieved", Error: err})
    }
})
/**
 * login validation, if(valid) redirects--> /profile
 * Endpoint: api/users/validate
 */
// router.post('/validate', body('email').isEmail(), body('password').isLength({ min: 5 }), async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     try{
//         const userData = await Students.findOne({where:{email: req.body.email}})
//         if(!userData){
//             res.status(404).json({message: "User not found!"})
//             return;
//         }
//         const validPassword = await userData.validatePassword(req.body.password);
//         if(!validPassword){
//             console.error("Error in post route /login/valdate: ", err)
//             res.status(400).json({message: "Incorrect email or password"});
//             return;
//         }
//         // setup user session
//         let expiry = new Date();
//         // session expiry 30 minutes
//         expiry.setMinutes(expiry.getMinutes() + 30); 
//         const sessionToken = uuid.v4();
//         const session = await Session.create({
//             user_id: userData.id,
//             session_token: sessionToken,  // session ID
//             expires_at: expiry,
//             active: true,
//         });
        
//         // sets the express-session as active
//         req.session.save(() => {
//             req.session.user_id = userData.id;
//             req.session.logged_in = true;
//         });

//         // set the users status to active in the database
//         const userSession = await Session.findOne({where: { user_id: userData.id }})
//         if (userSession) {
//             userSession.active = true;
//             await userSession.save();
//         }
//         // send back user info
//         res.status(201).redirect('/profile');

//     }catch(err){
//         console.error("Error in post route: ", err)
//         return res.status(500).json({message: 'Session interrupted unexpectedly: Session will refresh in 30 min'})
//     }
// });
/**
 * serves the forgot password page, user should input their email and request a forgot password email
 * Endpoint: /api/users/forgot
 */
router.get('/forgot', (req, res) => {
    try{
        res.status(200).render('login', { forgotPassword: true});
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
/**
 * login sends forgot password email, if(sucess) redirects--> /login
 * Endpoint: /api/users/forgot/retrieve
 */
router.post('/forgot/retrieve', async (req,res)=>{
    try{
        let email = req.body.email.trim();
        if(email){
            let student = await Students.findOne({
                where: {
                    email: email
                }
            });
            if(!student) {
                res.status(400).json({message: 'No user found with this email'});
                return;
            }
            console.log('--before transporter for forgot password--');
            await sendEmail(student.email, 'Your password reset', 'Please click the following link to reset your password: resetmypassword.com', '<p>Please click the following link to reset your password:</p><a href="https://www.resetmypassword.com" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>');
// todo- need to generate a unique token for each user and include it in the reset password link so that you can identify the user when the link is clicked.
            if(!mailOptions){
                res.status(400).json({message: 'Server email error @mailOption invalid input'});
                return;
            }
            try{
                transporter.sendMail(mailOptions,(error, info)=>{
                    if(error){
                        console.error('Error sending email:', error);
                        res.status(404).json({message: 'Error, failed to send'});
                        return;
                    }
                    setTimeout(() => {res.status(200).redirect('/login')}, 500);
                    console.info('Email sent:', info.response);
                });
            }catch(err){
                res.status(400).json({message: 'failed to send email', Error: err});
                console.log('Email not sent: ', err);
                return;
            }
        }
    }catch(err){
        res.status(400).json({message: 'Server error @ /forgot/retrieve', Error: err});
        console.log('Email failure: ', err);
    }
});
// 
/**
 * User clicks, they are authenticated, confirm logout template is rendered.
 * Endpoint: /api/users/logout' endpoint
 */
router.get('/logout', checkAuth1,(req, res) => {
    try{
        res.status(200).render('logout', { isLogoutTemplate: true });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
/**
 * User is asked if they are sure they want to logout, they either confirm or decline, clicking decline should send them to home.
 * Endpoint: /api/users/logout/confirm' endpoint
 */
router.get('/logout/confirm', async (req, res) => {
    req.session.destroy(async function (err) {
        if (err) {
            console.error(err);
            return res.status(500).send('Server Error');
        }
        try {
            let sessionToken = req.cookies.session_token;
            await Session.updateActiveStatus(false, sessionToken);
            await Session.kill(sessionToken);
        } catch (error) {
            console.error(error);
            return res.status(500).send('Server Error');
        }

        res.clearCookie('session_token'); // clear the browser cookie
        res.status(200).redirect('/api/users/login');
    });
});



module.exports = router;
