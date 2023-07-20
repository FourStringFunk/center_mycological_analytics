/**
 * Contact Routes.
 * @module api/contact_routes
 */
const router = require('express').Router();
const nodemailer = require('nodemailer');
const multer = require('multer'); // handles file uploads
const path = require('path');
const fs = require('fs');
require('dotenv').config();

let mailOptions = null;
let application = null;
let maxCount = 3;
// '/contact' endpoint 
router.post('/', (req,res) => {
    try{
        let first_name = req.body.firstName;
        let last_name = req.body.lastName;
        
        console.log('--before transporter--')
        const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth:{
                user: process.env.TRANSPORTERUSER,
                pass: process.env.TRANSPORTERPASS
            },
        });
        
        if(!transporter){
            res.status(500).json({message: 'Server email error @transporter (inside server route) credentials not valid'});
            return;
        }
        
        console.log('--before mail options--');
        
        let mailOptions = {
            from: req.body.email,
            to: (first_name && last_name) ? 'recipient@example.com' : process.env.TRANSPORTERRECIPIENT,
            subject: 'From the Contact form',
            text: (first_name && last_name) ? `${req.body.message} - ${first_name} ${last_name}` : req.body.message
        }
        
        if(!mailOptions){
            res.status(400).json({message: 'Server email error @mailOption invalid input'});
            return;
        }

        try{
            transporter.sendMail(mailOptions,(error, info)=>{
                if(error){
                    console.error('Error sending email:', error);
                    res.status(404).json({message: 'Error, failed to send'});
                    return;
                }
                res.status(200).json({message: info.response});
                console.log('Email sent:', info.response);
            });
        }catch(err){
            res.status(400).json({message: 'failed to send email', Error: err});
            console.log('Email not sent: ', err);
            return;
        }
    }catch(err){
        res.status(400).json({message: 'Server error @ /contact', Error: err});
        console.log('Email failure: ', err);
    }
});

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
// '/contact/apply' endpoint
router.post('/apply', upload.array('images', maxCount), (req,res) => {
    try {
        const filenames = req.files ? req.files.map(file => file.filename) : [];
        
        const application = {
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            address_1: req.body.address1,
            address_2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            country: req.body.country,
            zip: req.body.zip,
            employment_status: req.body.employmentStatus,
            employer_name: req.body.employerName,
            income: req.body.income,
            payment_plan: req.body.paymentPlan,
            uploads: filenames // Check if files exist and assign the filenames or an empty array
        }
        // write the application to the directory
        const dir = path.join(__dirname, '../../utils/uploads/applications');
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }

        const filename = path.join(dir, `${application.first_name}_${application.last_name}_${Date.now()}.json`);
        fs.writeFileSync(filename, JSON.stringify(application, null, 4));

        res.status(200).json({ message: "Application received", application: application });
    } catch(err) {
        res.status(400).json({message: 'Server error @ contact_routes.js /contact/apply', Error: err})
        console.log('Email failure: ', err);
    }
});

module.exports = router;

  