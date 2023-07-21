/**
 * Express router
 * all uncommented routes should be funtional
 */
const router = require('express').Router();
const apiRoutes = require('./api');
const home = require('./home_route')

router.use('/', home);
router.use('/api', apiRoutes);


router.use((req,res) =>{
    res.send("❗❗ We missed the router friends! ❗❗")
})

module.exports = router;