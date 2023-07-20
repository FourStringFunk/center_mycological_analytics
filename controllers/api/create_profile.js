/**
 * Contact Routes.
 * @module api/sign_up_routes
 */
const router = require('express').Router();
const Student = require('../../models/Students');
const Session = require('../../models/Session')
const uuid = require('uuid');
let userData = {};

// '/createProfile' endpoint
router.get('/', (req, res) => {
    try{
        res.status(200).render('createProfile', { isSignUpTemplate: true, imageUrl });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
// '/createProfile/newuser' endpoint
// validate their email is good and not a duplicate
router.post('/newuser', async (req,res)=>{
    let imageUrl;
    if(req.body) {
        userData = {
            first_name: req.body.fName,
            last_name: req.body.lName,
            username: "",
            email: req.body.email,
            password_hash: "",
            role: 'user',
            dob: req.body.dob,
            zip: parseInt(req.body.zip),
        }
    } else {
        res.status(400).json({message: "Email already exists."})
        return
    }
    try{
        const duplicateData = await User.findOne({where:{email: userData.email}})
        if(duplicateData){
            res.status(409).json({message: "Email already exists."})
            return;
        }    
        fetch('https://source.unsplash.com/random')
        .then(response => {
            imageUrl = response.url;
        })
        .catch(error => {
            console.log(error);
            imageUrl = "/img/tech2.png";
        })
        .finally(() => {
            try{
                res.status(200).render('newUser', { isNewUserTemplate: true, imageUrl });
            }catch(error){
                console.error(error);
                res.status(500).send('Server Error')
            }
        });
    }catch(err){
        console.error({message: "Error in post route: ", Error: err})
    }
})