/**
 * Multer helper function
 * for uploading documents
 */


const multer = require('multer'); 
const path = require('path');

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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        // preserve the file extention coming from the user
        const fileExtension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension);
    },
  });
  // Create multer upload middleware using the storage configuration



module.exports = storage;