const router = require('express').Router();

const Students = require('../../models/Students')

const getProfile = require('../../utils/getStudentProfile')
const checkAuth2 = require('../../utils/checkAuth')
const fetchCourses = require('../../utils/fetchCompletedCourses')
const path = require('path');
const fs = require('fs');
/**
 * User profile route, serves up the users data for the 'dashboard' page
 * Endpoint: api/proile
 * 
 */
router.get('/', checkAuth2 , async (req, res) => {
    let cookieUserId = req.session.user_id;
    try {
        const studentData = await getProfile(cookieUserId);
        let {student, courses} = studentData
        if (studentData) {
            // returns an 2 arrays
            return res.status(200).render('dashboard', { isProfileTamplate: true, student, courses });
        } else {
            // User does not have any posts
            res.status(400).json({message: 'There is no data for the requested student'});
        }
    } catch(err) {
        // Handle any errors
        console.error(err);
        res.status(500).send('Server error');
    }
});
/**
 *  User profile route, serves up the users data for the 'dashboard' page
 *  Endpoint: api/profile/viewCertificate/:certificateId
 * **This enpoint requires an :id, and the certificate id should be sent to it from client side according to the mock-up
 */
router.get('/viewCertificate/:certificateId', checkAuth2 ,async (req, res) => {
    let studentId = req.session.user_id;
try{
    if(!req.session.logged_in == true){
        return res.status(401).send('Please log in to view this certificate');
    }
    const certificateId = req.params.certificateId;
    // Fetch the list of completed courses
    const completedCourses = await fetchCourses(studentId)
    // Check if the course associated with this certificate is in the user's list of completed courses
    if (!completedCourses.includes(certificateId)) {
        return res.status(403).send('You do not have permission to view this certificate');
    }

    // the certificate pdf file needs to be stored in a folder named "certificates" in the root directory.
    
    // The certificate filename is assumed to be the certificateId with a .pdf extension.
    const filePath = path.join(__dirname, 'certificates', `${certificateId}.pdf`);
    // Check if the file exists
    if (fs.existsSync(filePath)) {
        res.status(200).sendFile(filePath);
    } else {
        res.status(404).send('Certificate not found');
    }
}catch(err){
    res.status(500).send('Server Error', err);
}
});
/**
 *  Update profile route
 *  Endpoint: api/profile/updateProfile
 * 
 */
router.get('/update', checkAuth2, (res,req) =>{
    try{
        res.status(200).render('(TBD)');
        return;
    }
    catch(err){
        res.status(500).json({message: 'Server error', Error: err})
        console.error(err)
    }
})

router.put('/update/profile', checkAuth2, async (req,res) =>{
    try{
        if(!req.body){
            return res.status(409).json({message: "Recieved no data"})
        }
        const userData = await Students.findOne({
            where: {
                id: req.session.user_id 
            }
        })
        let updateData = {
            email: req.body.email || userData.email,
            first_name: req.body.firstName || userData.first_name,
            last_name: req.body.lastName || userData.last_name,
            address_1: req.body.address1 || userData.address1,
            address_2: req.body.address2 || userData.address2,
            city: req.body.city || userData.city,
            state: req.body.state || userData.state,
            country: req.body.country || userData.country,
            zip: req.body.zip ||userData.zip,
            employment_status: req.body.employmentStatus || userData.employment_status,
            employer_name: req.body.employerName || userData.employer_name,
            income: req.body.income || userData.income,
        }
        if(!updateData){
            return res.status(409).json({message: "Data is incomplete"})
        }

        await userData.update(updateData)

        res.status(200).render('/api/profile');
        return;
    }
    catch(err){
        res.status(500).json({message: 'Server error', Error: err})
        console.error(err)
    }
})


module.exports = router;