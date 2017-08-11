var express = require('express');
var router = express.Router();
var app = express();
app.use('/', require('./articles'))
module.exports = app;