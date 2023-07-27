/**
 * Register partials with Handlebars
 * 
 */
const handlebars = require('handlebars');
const fs = require('fs');

const partialTemplate1 = fs.readFileSync('../views/partials/forgot.handlebars', 'utf8');
handlebars.registerPartial('forgot', partialTemplate1);

const partialTemplate2 = fs.readFileSync('../views/partials/altNavigation.handlebars', 'utf8');
handlebars.registerPartial('altNavigation', partialTemplate2); 

const partialTemplate3 = fs.readFileSync('../views/partials/viewAndComment.handlebars', 'utf8');
handlebars.registerPartial('viewAndComment', partialTemplate3);