const router = require('express').Router();
const fetch = require('node-fetch');
const fs = require('fs')

// '/' endpoint for home.
router.get('/', async (req, res) => {
    const mainHeroImg = fs.readFileSync('/img/pexels-artem-podrez-5726794.jpg')
    try{
        res.status(200).render('homepage', { homepage: true, mainHeroImg });
    }catch(error){
        console.error(error);
        res.status(500).send('Server Error');
}});
    
module.exports = router;
