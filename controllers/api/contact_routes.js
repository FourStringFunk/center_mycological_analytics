/**
 * Contact Routes.
 * @module api/contact_routes
 */
const router = require('express').Router();
const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const multer = require('multer'); 
const path = require('path');
const fs = require('fs');
require('dotenv').config();
let maxCount = 3;
/**
 * contact page route, send an email from the contact page if(success) redirect--> '/'
 * Endpoint: /api/contact
 */
router.post('/', (req,res) => {
    let first_name = req.body.firstName;
    let last_name = req.body.lastName;
    let email = req.body.email;
    let message = req.body.message;

    const auth = {
        auth: {
          api_key: process.env.MAILGUN_API_KEY,
          domain: process.env.MAILGUN_DOMAIN
        }
    }

    const transporter = nodemailer.createTransport(mg(auth));
    console.log('--before mail options--');
    let mailOptions = {
        from: email,
        to: (first_name && last_name && email && message) ? 'guybeals01@gmail.com' : 'shadowkeeper70@gmail.com',
        subject: 'From the Contact form',
        text: (first_name && last_name && email && message) ? `${message} - ${first_name} ${last_name}` : message,
    }

    transporter.sendMail(mailOptions,(error, info)=>{
        if(error){
            console.error('Error sending email:', error);
            res.status(500).json({message: 'Server error, failed to send email', Error: error});
        } else {
            console.info('Email sent to:', mailOptions.to);
            res.status(200).json({message: 'You successfully sent a message'})
        }
    });
});
/**
 * Multer helper function
 * for uploading images (i left this here for testing) once tested should be moved to another file and imported)
 */
// handle file uploads
// key functions defined within this object: destination and filename.
const storage = multer.diskStorage({    
    // specifies how uploaded files should be stored on the disk
        destination: function (req, file, cb) {
    // Specify the destination folder for uploaded files
        cb(null, path.join(__dirname, '../../utils/uploads/')); // cb is a callback function to provide the destination folder    
    },
    filename: function (req, file, cb) {
      // Generate a unique filename for the uploaded file
      const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + suffix);
    },
  });
  // Create multer upload middleware using the storage configuration
const upload = multer({ storage: storage });

/**
 * application page route, if(success) file written at /utils/uploads/applications, then redirect--> '/'
 * Endpoint: api/contact/scholarship
 */
router.post('/scholarship', upload.single('coverLetter'), (req, res) => {
    try {
        const uploadedFilename = req.file ? req.file.filename : ""; // filename is now a string, not an array
        
        let application = {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            address_1: req.body.address1,
            address_2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            zip: req.body.zip,
            employment_status: req.body.employmentStatus,
            employment_status2: req.body.employmentStatus2,
            employer_name: req.body.employerName,
            income: req.body.incomeRange,
            payment_plan: req.body.paymentPlan,
            uploads: uploadedFilename // Filename is a string
        }
        // write the application to the directory
        const dir = path.join(__dirname, '/utils/uploads');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        const filename = path.join(dir, `${application.first_name}_${application.last_name}_${Date.now()}.json`);
        fs.writeFileSync(filename, JSON.stringify(application, null, 4));
        console.info({Application: application})
        res.status(200).redirect('/');
    } catch(err) {
        res.status(400).json({message: 'Server error @ contact_routes.js /contact/apply', Error: err})
        console.log('Email failure: ', err);
    }
});



module.exports = router;

  