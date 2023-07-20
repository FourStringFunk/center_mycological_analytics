/**
 * Register partials with Handlebars
 * 
 */
const handlebars = require('handlebars');
const fs = require('fs');

const partialTemplate1 = fs.readFileSync('../views/partials/newPost.handlebars', 'utf8');
handlebars.registerPartial('somePartial', partialTemplate1);

const partialTemplate2 = fs.readFileSync('../views/partials/viewPost.handlebars', 'utf8');
handlebars.registerPartial('viewPost', partialTemplate2);

const partialTemplate3 = fs.readFileSync('../views/partials/viewAndComment.handlebars', 'utf8');
handlebars.registerPartial('viewAndComment', partialTemplate3);