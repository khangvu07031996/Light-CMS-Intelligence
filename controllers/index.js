var express = require('express');
var router = express.Router();
var app = express();

app.use('/',require('./session'))
router.get('/',function(req,res){
	res.render('SessionForm');
})
app.use('/',require('./user'))
app.use('/',require('./author'))
app.use('/',require('./keyword'))
module.exports = app;