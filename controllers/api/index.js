const router = require('express').Router();
const userRoutes = require('./user_routes');
const contactRoutes = require('./contact_routes');
const pingRoute = require('./ping_route');

router.use('/users', userRoutes); // for loggin in an out
router.use('/contact', contactRoutes); // for loggin in an out
router.use('/ping', pingRoute);

router.use((req,res) =>{
    res.send("❗❗ We missed the in /api ! ❗❗")
})

module.exports = router;
