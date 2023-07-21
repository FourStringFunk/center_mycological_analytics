/**
 * Routes for signing out
 */
const router = require('express').Router();
const Session = require('../../models/Session');
const checkAuth1 = require('../../utils/checkAuth')
// authenticate user

// Middleware to check if user is authenticated
// '/logout' endpoint
router.get('/', checkAuth1 ,(req, res) => {
    try{
        res.status(200).render('logout', { isLogoutTemplate: true });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error')
    }
});
// '/logout/confirm' endpoint
router.get('/confirm', (req, res) => {
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