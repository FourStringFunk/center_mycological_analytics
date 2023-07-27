const router = require('express').Router();
const fetch = require('node-fetch');
const fs = require('fs')
const Courses = require('../models/Courses')
const chalk = require('chalk')
/**
 * Homepage route
 * Endpoint: /
 */
router.get('/', async (req, res) => {
    // const mainHeroImg = fs.readFileSync('/img/pexels-artem-podrez-5726794.jpg')
 
    try{
        const altNavigation = null;
        if(req.cookies.session_token){
            altNavigation = { homePageTemplate: true , altNavigation : true}
        }else{
            altNavigation = { homePageTemplate: true , altNavigation : false}
        }
        res.status(200).render('homepage', altNavigation);
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
router.get('/courses', async (req, res) => {
    
    try{
        const mushroomCourses = await Courses.findAll();
        const courses = mushroomCourses.map(course => course.get({ plain: true }));
     
        console.log(chalk.red(courses))
      // calls courses template, getCourses() is a helper function
        res.status(200).render('courses', { isCoursesTemplate: true, courses });
        return;
    }
    catch(err){
        res.status(500).json({message: 'Courses page failed to load', Error: err})
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
 * Endpoint: /getConnected
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