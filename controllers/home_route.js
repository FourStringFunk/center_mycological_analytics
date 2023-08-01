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
        let altNavigation = null;
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
        let altNavigation = null;
        if(req.cookies.session_token){
            altNavigation = { isScholarships: true , altNavigation : true}
        }else{
            altNavigation = { isScholarships: true , altNavigation : false}
        }
        res.status(200).render('scholarships', altNavigation);
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
        let altNavigation = null;
       
        const mushroomCourses = await Courses.findAll();
        const courses = mushroomCourses.map(course => course.get({ plain: true }));

        if(req.cookies.session_token){
            altNavigation = { isCoursesTemplate: true, courses, altNavigation : true}
        }else{
            altNavigation = { isCoursesTemplate: true, courses, altNavigation : false}
        }
        res.status(200).render('Courses', altNavigation);
        return;
    }
    catch(err){
        res.status(500).json({message: 'Courses page failed to load', Error: err})
        console.error(err)
    }
});
/**
 * about page route
 * Endpoint: /about
 */
router.get('/about', (req, res) => {
    
    try{
        let altNavigation = null;
        if(req.cookies.session_token){
            altNavigation = { isAboutTemplate: true , altNavigation : true}
        }else{
            altNavigation = { isAboutTemplate: true , altNavigation : false}
        }
        res.status(200).render('about', altNavigation);
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
        let altNavigation = null;
        if(req.cookies.session_token){
            altNavigation = { isAboutTemplate: true , altNavigation : true}
        }else{
            altNavigation = { isAboutTemplate: true , altNavigation : false}
        }
        res.status(200).render('(TBD)');
        return;
    }
    catch(err){
        res.status(400).json({message: 'About page failed to load', Error: err})
        console.error(err)
    }
});



module.exports = router;