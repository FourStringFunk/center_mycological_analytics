const router = require('express').Router();
const fetch = require('node-fetch');
const fs = require('fs')

// '/' endpoint for home.
router.get('/', async (req, res) => {
    // const mainHeroImg = fs.readFileSync('/img/pexels-artem-podrez-5726794.jpg')
    try{
        res.status(200).render('homepage');
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error');
}});

// NAVIGATION ROUTERS
// About page
router.get('/about', async (req, res) => {
    try{
        res.status(200).render('about', {isAboutTemplate});
    } catch(error) {
        console.error(error);
        res.status(500).send('Server Error');
    };
});

// Scholarships Page

// Courses Page
    
module.exports = router;



