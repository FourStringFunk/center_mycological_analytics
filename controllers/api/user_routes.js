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
/**
 * login page route serves the content
 * Endpoint: /users/login
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
 * login validation, if(valid) redirects--> /profile
 * Endpoint: /users/validate
 */
router.post('/validate', body('email').isEmail(), body('password').isLength({ min: 5 }), async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try{
        const userData = await Students.findOne({where:{email: req.body.email}})
        if(!userData){
            res.status(404).json({message: "User not found!"})
            return;
        }
        const validPassword = await userData.validatePassword(req.body.password);
        if(!validPassword){
            console.error("Error in post route /login/valdate: ", err)
            res.status(400).json({message: "Incorrect email or password"});
            return;
        }
        // setup user session
        let expiry = new Date();
        // session expiry 30 minutes
        expiry.setMinutes(expiry.getMinutes() + 30); 
        const sessionToken = uuid.v4();
        const session = await Session.create({
            user_id: userData.id,
            session_token: sessionToken,  // session ID
            expires_at: expiry,
            active: true,
        });

        // sets the express-session as active
        req.session.user_id = userData.id;

        // set the users status to active in the database
        const userSession = await Session.findOne({where: { user_id: userData.id }})
        if (userSession) {
            userSession.active = true;
            await userSession.save();
        }
        // send back user info
        res.status(201).redirect('/profile');

    }catch(err){
        console.error("Error in post route: ", err)
        return res.status(500).json({message: 'Session interrupted unexpectedly: Session will refresh in 30 min'})
    }
});
/**
 * serves the forgot password page, user should input their email and request a forgot password email
 * Endpoint: /users/forgot
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
 * Endpoint: /users/forgot/retrieve
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

/**
 * User clicks, they are authenticated, confirm logout template is rendered.
 * Endpoint: /users/logout' endpoint
 */
router.get('/logout', checkAuth1 ,(req, res) => {
    try{
        res.status(200).render('logout', { isLogoutTemplate: true });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
/**
 * User is asked if they are sure they want to logout, they either confirm or decline, clicking decline should send them to home.
 * Endpoint: users/logout/confirm' endpoint
 */
router.get('logout/confirm', (req, res) => {
    try {
        req.session.destroy(function (err) {
        if (err) {
            // Handle error, you can also use next(err) if you have a error handler middleware in express
            console.error(err);
            return res.status(500).send('Server Error');
        }
        let sessionToken = req.cookies.session_token
        Session.updateActiveStatus(false, sessionToken)
        Session.kill(sessionToken);
        // Session destroyed, user logged out
        res.clearCookie('session_token'); // clear the browser cookie
        res.status(200).render('logout', { isConfirmLogOut: true });
    });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});



module.exports = router;
