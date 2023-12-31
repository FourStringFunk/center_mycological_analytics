/**
 * 2 different functions to authorize user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */

const { ValidationError } = require("sequelize");
const Session = require('../models/Session')
// authorizes
async function checkAuth1(req, res, next) {
    let sessionToken = req.cookies.session_token; // this is the users id that is saved in the session
    if (!sessionToken) {
        await Session.updateActiveStatus(false, sessionToken);
        await Session.kill(sessionToken);
        res.redirect("/")
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
            next(); // Session is valid, continue to the requested route
        } else {
            // Session is not valid, redirect the user to the signup page
            await Session.updateActiveStatus(false, sessionToken);
            await Session.kill(sessionToken);
            res.redirect("/")
            return
        }
    } catch(err) {
        console.error('error: '+ err); // log the error
        await Session.updateActiveStatus(false, sessionToken);
        await Session.kill(sessionToken);
        res.redirect("/")
    }
}
// authenticates
async function checkAuth2(req, res, next) {
    let sessionToken = req.cookies.session_token; // this is the users id that is saved in the session
   
    if (!sessionToken) {
        await Session.updateActiveStatus(false, sessionToken);
        await Session.kill(sessionToken);
        res.redirect("/")
        return
    }
    // Search for the users session in the database by their cookieUserId saved by express-sessions
    const userSession = await Session.findOne({ where: { session_token: sessionToken } }); 
    try {
        if (!userSession) {
            throw new ValidationError('Session not found'); // throws an error if no session found
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
            await Session.updateActiveStatus(false, sessionToken);
            await Session.kill(sessionToken);
            res.redirect("/")
        }
    } catch(err) {
        console.error('error: '+ err); // log the error
        await Session.updateActiveStatus(false, sessionToken);
        await Session.kill(sessionToken);
        res.redirect("/")
    }
}

module.exports = checkAuth1, checkAuth2