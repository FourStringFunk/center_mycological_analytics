/**
 * Sends forgot password email
 * @param {*} email 
 * @param {*} subject 
 * @param {*} text 
 * @param {*} html 
 */
const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text, html) => {
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth:{
        user: process.env.TRANSPORTERUSER,
        pass: process.env.TRANSPORTERPASS
      },
    });
    
    let mailOptions = {
      from: process.env.FORGOTPASSWORD,
      to: email,
      subject: subject,
      text: text,
      html: html,
    };
  
    await transporter.sendMail(mailOptions);
  };

  module.exports = sendEmail;