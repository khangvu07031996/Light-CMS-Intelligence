var express = require('express');
var router = express.Router();
var app = express();
app.use('/',require('./article'));
app.use('/',require('./detailArticle'));
module.exports = app; 