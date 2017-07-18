var express = require('express');
var router = express.Router();
var app = express();

app.use('/',require('./session'))

app.use('/',require('./user'))
app.use('/',require('./author'))
app.use('/',require('./keyword'))
app.use('/',require('./article'))
module.exports = app;