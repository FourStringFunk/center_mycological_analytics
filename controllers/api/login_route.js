const router = require('express').Router();
const Students = require('../../models/students');
const Session = require('../../models/session')
const uuid = require('uuid');
const nodemailer = require('nodemailer');

//  /login route to render needed content
router.get('/', (req, res) => {
    try{
        res.status(200).render('login', { isLoginTemplate: true, imageUrl });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});

//  /login/fogot route to render needed content
router.get('/forgot', (req, res) => {
    try{
        res.status(200).render('login', { forgotPassword: true, imageUrl });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
// send a reset password email
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
            console.log('student-email: ', email)    
            console.log('--before transporter for forgot password--');
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth:{
                    user: process.env.TRANSPORTERUSER,
                    pass: process.env.TRANSPORTERPASS
                },
            });
            if(!transporter){
                res.status(500).json({message: 'Server email error @transporter (inside server route) credentials not valid'});
                return;
            }
            console.log('--before mail options forgot password--');
            let mailOptions = {
                from: process.env.FORGOTPASSWORD,
                to: student.email,
                subject: 'Your password reset',
                text: 'Please click the following link to reset your password: resetmypassword.com',
                html: `<p>Please click the following link to reset your password:</p>
                       <a href="http://www.resetmypassword.com" style="display: inline-block; padding: 10px 20px; color: white; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Reset Password</a>`
                };
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
                    res.status(200).json({message: info.response});
                    console.log('Email sent:', info.response);
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

// '/login' endpoint
router.post('/', async (req, res) => {
    try{
        const userData = await Students.findOne({where:{email: req.body.email}})
        if(!userData){
            res.status(404).json({message: "User not found!"})
            return;
        }
        const validPassword = await userData.validatePassword(req.body.password);
        if(!validPassword){
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
        req.session.active = true;
        await req.session.save()

        // set the users status to active in the database
        const userSession = await Session.findOne({where: { user_id: userData.id }})
        if (userSession) {
            userSession.active = true;
            await userSession.save();
            }
        
               // send back session info
     res.status(201).json({ message: session });
    }catch(err){
        console.error({message: "Error in post route: ", Error: err})
        return res.status(500).json({message: 'Session interrupted unexpectedly: Session will refresh in 30 min'})
    }
});
module.exports = router;
