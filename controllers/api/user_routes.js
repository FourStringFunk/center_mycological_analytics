/**
 * User Routes.
 * @module /api/users
 */
require('dotenv').config();
const router = require('express').Router();
const Students = require('../../models/Students');
const Session = require('../../models/Session');
const uuid = require('uuid');
const checkAuth1 = require('../../utils/checkAuth')
const shortid = require('shortid');
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
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
 * This route take data from the login page and if data is good, allows user to login
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
     // Set the initial expiration time of the session for 10 minutes
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); 
      const sessionToken = uuid.v4();
      // setting the session in the database
      const newSession = await Session.create({
          user_id: userData.id,
          session_token: sessionToken,  // session IDs
          expires_at: expiresAt,
        });
        
        // sets the express-session as active
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
        });
        
        // set the users status to active in the database
        const userSession = await Session.findOne({where: { user_id: userData.id }})
        if (userSession) {
            userSession.active = true;
            await userSession.save();
        }
        // send back the newSession info to user
        res.status(200).json({ newSession })
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
        // Set the initial expiration time of the session for 10 minutes
        expiresAt.setMinutes(expiresAt.getMinutes() + 10); 
        const sessionToken = uuid.v4();
        // set the session in the database
        const newSession = await Session.create({
            user_id: studentData.id,
            session_token: sessionToken,  // session IDs
            expires_at: expiresAt,
        });
        // set the session on req session
        req.session.save(() => {
            req.session.user_id = studentData.id;
            req.session.logged_in = true;
        });

        // set the users status to active in the database
        const userSession = await Session.findOne({where: { user_id: studentData.id }})
        if (userSession) {
            userSession.active = true;
            await userSession.save();
        }

       res.status(200).json({ newSession })
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
        let email = req.body.email;
        console.log(email)
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
            const auth = {
                auth: {
                  api_key: process.env.MAILGUN_API_KEY,
                  domain: process.env.MAILGUN_DOMAIN
                }
            }
            // example use of how wed send a token to setup the password reset token for security
            // let resetLink = `https://yourapp.com/resetPassword/${user.resetPasswordToken}`; // replace with your reset password route
            let resetLink = "/"
            let mailOptions = {
                from: "guymorganb@gmail.com",
                to: email,
                subject: 'Your Password reset link',
                html: `<p>You requested for a password reset, kindly click on the button below to reset your password:</p> 
                    <button style="background-color: #4CAF50; /* Green */
                                    border: none;
                                    color: white;
                                    padding: 15px 32px;
                                    text-align: center;
                                    text-decoration: none;
                                    display: inline-block;
                                    font-size: 16px;
                                    margin: 4px 2px;
                                    cursor: pointer;"><a href='${resetLink}' style='color: white; text-decoration: none;'>Reset Password</a></button> 
                    <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
            }
            const transporter = nodemailer.createTransport(mg(auth));
            console.log('--before transporter for forgot password--');
            transporter.sendMail(mailOptions,(error, info)=>{
                if(error){
                    console.error('Error sending email:', error);
                    res.status(500).json({message: 'Server error, failed to send email', Error: error});
                } else {
                    console.info('Email sent to:', mailOptions.to);
                    res.status(200).json({message: 'You successfully sent a message'})
                }
            });
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
        res.status(200).redirect('/');
    });
});



module.exports = router;
