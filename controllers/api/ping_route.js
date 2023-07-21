/**
 * route for handling pings coming from user activity from the view post & new post are loaded in the browser
 */
const router = require('express').Router();
const Session = require('../../models/Session')
/**
 * contact page route, send an email from the contact page if(success) redirect--> '/'
 * Endpoint: /contact
 */
router.post('/', (req, res) => {
  try{
    const sessionToken = req.cookies.session_token;
    if(!sessionToken){
      res.status(400)
      return;
    }
    // ping route to update the session model 'updated_at'
    Session.updatePing(sessionToken)
      .then(() => res.sendStatus(200))
      .catch(error => {
        console.error('Error:', error);
        res.status(500).json({message: 'Server Error', Error: err})
      });
    
  }catch(err){
    res.status(500).json({message: 'Server Error', Error: err})
  }
});
module.exports = router;