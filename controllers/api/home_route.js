const router = require('express').Router();
const fetch = require('node-fetch');
const fs = require('fs')

/**
 * Homepage route
 * Endpoint: /
 */
router.get('/', async (req, res) => {
    // const mainHeroImg = fs.readFileSync('/img/pexels-artem-podrez-5726794.jpg')
    try{
        res.status(200).render('homepage', { homePageTemplate: true });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error');
}});
/**
 * about page route
 * Endpoint: /about
 */
router.get('/about', (req, res) => {
    
    try{
        res.status(200).render('about', { aboutPageTemplate: true });
        return;
    }
    catch(err){
        res.status(400).json({ message: 'About page failed to load', Error: errb})
        console.error(err)
    }
});
/**
 * courses page route
 * Endpoint: /courses
 */
router.get('/courses', (req, res) => {
    
    try{
        res.status(200).render('about', { courseTamplate: true });
        return;
    }
    catch(err){
        res.status(400).json({message: 'About page failed to load', Error: err})
        console.error(err)
    }
});
/**
 * scholarships page route
 * Endpoint: /scholarships
 */
router.get('/scholarships', (req, res) => {
    
    try{
        res.status(200).render('about', { scholarshipTemplates: true });
        return;
    }
    catch(err){
        res.status(400).json({message: 'About page failed to load', Error: err})
        console.error(err)
    }
});

module.exports = router;