const router = require('express').Router();
const Session = require('../../models/Session');
const Students = require('../../models/Students')
const StudentCourses = require('../../models/StudentCourses')
const { v4: uuidv4 } = require('uuid');
const checkAuth2 = require('../../utils/checkAuth')

/**
 *
 * 
 */
router.get('/', checkAuth2 , async (req, res) => {
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
/**
 * 
 * 
 */
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