/**
 * Contact Routes.
 * @module api/sign_up_routes
 */
const router = require('express').Router();
const Student = require('../../models/Students');
const Session = require('../../models/Session')
const uuid = require('uuid');
let userData = {};
/**
 * create profile route, serves the content
 * Endpoint: /createProfile
 */
router.get('/', (req, res) => {
    try{
        res.status(200).render('createProfile', { isCreateProfileTemplate: true, imageUrl });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
/**
 * new user route, checks the users email, creates a new 
 * Endpoint: /createProfile/newuser
 */
router.post('/newuser', async (req,res)=>{
    try{
        const duplicateData = await Student.findOne({where:{email: req.body.email}})
        if(duplicateData){
            res.status(409).json({message: "Email already exists."})
            return;
        }
        if(!req.body) {
            res.status(409).json({message: "You didnt send any data."})
            return
        } 
        let expiresAt = new Date();
        // Set the initial expiration time of the session for 30 minutes
        expiresAt.setMinutes(expiresAt.getMinutes() + 30); 
        const sessionToken = uuid.v4();
        userData = await Student.create({
            first_name: req.body.fName,
            last_name: req.body.lName,
            email: req.body.email,
        })
        // set the session in the database
        const newSession = await Session.create({
            user_id: userData.id,
            session_token: sessionToken,  // session IDs
            expires_at: expiresAt,
            active: true,
        });
        // set the session on req session
        req.session.save(() => {
            req.session.user_id = userData.id;
            req.session.logged_in = true;
            res.json({ user: userData, message: 'You are now logged in!' });
        });
        setTimeout(() => {res.status(200).redirect('/profile')}, 500)
    }
    catch(err){
        console.error({message: "Error in post route: ", Error: err})
        res.status(400).json({message: "Bad request, no data recieved", Error: err})
    }
})
