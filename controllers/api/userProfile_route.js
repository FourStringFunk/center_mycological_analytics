const router = require('express').Router();
const Session = require('../../models/Session');
const Students = require('../../models/Students')
const StudentCourses = require('../../models/StudentCourses')
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
//its probably best to use a dedicated middleware for authorization like passport.js
// Middleware to check if user is authenticated
async function checkAuth(req, res, next) {
    let sessionToken = req.cookies.session_token; // this is the users id that is saved in the session
   
    if (!sessionToken) {
        res.redirect('/signup')
        return
    }
    // Search for the users session in the database by their cookieUserId saved by express-sessions
    const userSession = await Session.findOne({ where: { session_token: sessionToken } }); 
    try {
        if (!userSession) {
            throw new Error('Session not found'); // throws an error if no session found
        }
        const rightNow = new Date();
        const sessionExpiration = new Date(userSession.expires_at);
        if (rightNow < sessionExpiration) {
            // resets the session
            req.session.user_id = userSession.user_id
            req.session.active = true;
            await req.session.save(),

            next(); // Session is valid, continue to the requested route

            console.log(chalk.blue("Session is valid, browser and Database match: "), chalk.green(req.cookies.session_token), "|", chalk.blue("Session user_id: "), chalk.green(req.session.user_id));
        } else {
            // Session is not valid, redirect the user to the signup page
            res.redirect('/signup');
        }
    } catch(err) {
        console.error('error: '+ err); // log the error
        res.redirect('/signup');
    }
}
// '/userProfile' endpoint
// allows user to view all community posts, but if user has no posts, they cant see everyones posts
router.get('/', checkAuth , async (req, res) => {
    let cookieUserId = req.session.user_id;
    try {
        const userHasPosts = await getUserPostData(cookieUserId);;
        
        if (userHasPosts) {
            // User has posts
            const postDataList = await fetchPostData();  // Fetch posts data
            return res.status(200).render('dashboard', { viewAndCommentTemplate: true, imageUrl, postDataList });
        } else {
            // User does not have any posts
            res.status(200).render('dashboard', { isDashboardTemplate: true, imageUrl });
        }
    } catch(err) {
        // Handle any errors
        console.error(err);
        res.status(500).send('Server error');
    }
});

// '/userProfile/newpost' endpoint
// allows user to access new post feature
router.get('/newpost', (req, res) => {
    let imageUrl;
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
                res.status(200).render('dashboard', { isNewPostTemplate: true, imageUrl });
            }catch(error){
                console.error(error);
                res.status(500).send('Server Error')
            }
        });
});
// '/userProfile/viewpost' endpoint
// allows user to view their posts
router.get('/viewposts', checkAuth, async (req, res) => {
    let cookieUserId = req.session.user_id;
    let imageUrl

    if(!cookieUserId){
        return res.status(401).json({ error: "No user id found in session"})
    }

    try{
        let response = await fetch('https://source.unsplash.com/random');
        imageUrl = response.url;
    }catch(err){
        console.error(err);
        imageUrl = "/img/tech4.png";
    }
    try {
        let postDataList = await getUserPostData(cookieUserId);
        res.status(200).render('dashboard', { isViewPostTemplate: true, imageUrl, postDataList });
    } catch(error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});
// '/userProfile/viewposts/createnew' endpoint
// creates new post
router.post('/viewposts/createnew', checkAuth, async (req, res) => {
    try{
        const {title, body} = req.body;
        let cookieUserId = req.session.user_id;
        console.log("req.session.user_id: ",  req.session.user_id)
            if(!cookieUserId){
                console.error({error: "No user id found in session"})
                res.status(401).redirect('/viewposts');
                return;
            }

            let uuid = uuidv4();
            let newBlogPost = {
                id: uuid,
                title: title,
                body: body,
                user_id: cookieUserId
            }

        try{
            await Post.create(newBlogPost)
            
            res.redirect('/dashboard/viewposts');
        }catch(err){
            console.error(err);
            res.status(500).json({message: 'Server Error', error: err})
        }
    }catch(err){
        res.status(500).json({message: "server error", Error: err})
    }
});

module.exports = router;