const router = require('express').Router();
const Student = require('../../models/Students');
const Session = require('../../models/session')
const uuid = require('uuid');

//  /login route to render needed content
// router.get('/', (req, res) => {
//     let imageUrl;
//     try{
//         res.status(200).render('login', { isLoginTemplate: true, imageUrl });
//     }catch(error){
//         console.error(error);
//         res.status(500).send('Server Error')
//     }
        
// });

// '/login' endpoint
router.get('/', async (req, res) => {
    try{
        const userData = await Student.findOne({where:{email: req.body.email}})

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
