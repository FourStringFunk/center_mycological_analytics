/**
 * Express router
 */
const router = require('express').Router();
//const commentRoutes = require('./comment_routes');
const dashboard = require('./api/dashboard_routes');
const contact = require('./api/contact_routes');
const login = require('./api/login_routes')
const createprofile= require('./api/create_profile')
// const home = require('./api/home_routes')
const logout = require('./api/logout_routes')
// const ping = require('./api/ping_route')
// gets all user comments and posts
router.use('/', home);
// for loging in directly
router.use('/login', login)
// for the dashboard
router.use('/dashboard', dashboard)
// for signing up
router.use('/createProfile', createprofile)
// for signing out
router.use('/logout', logout)
//for contact page
router.use('/contact', contact)
// for ping
// router.use('/ping', ping)


router.use((req,res) =>{
    res.send("❗❗ We missed the router friends! ❗❗")
})

module.exports = router;