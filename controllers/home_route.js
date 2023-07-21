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
 * Endpoint: /scholarships
 * 
 * This route renders scholarship page, (Page not built yet)
 */
router.get('/scholarships', (req, res) => {
    
    try{
        res.status(200).render('scholarships', { isScholarships: true });
        return;
    }
    catch(err){
        res.status(400).json({ message: 'About page failed to load', Error: err})
        console.error(err)
    }
});
/**
 * courses page route
 * Endpoint: /courses
 * 
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
 * Endpoint: /about
 */
router.get('/about', (req, res) => {
    
    try{
        res.status(200).render('about', { isAboutTemplate: true });
        return;
    }
    catch(err){
        res.status(400).json({message: 'About page failed to load', Error: err})
        console.error(err)
    }
});
/**
 * Connection page route
 * Endpoint: /connection
 */
router.get('/connection', (req, res) => {
    
    try{
        res.status(200).render('(TBD)');
        return;
    }
    catch(err){
        res.status(400).json({message: 'About page failed to load', Error: err})
        console.error(err)
    }
});



module.exports = router;