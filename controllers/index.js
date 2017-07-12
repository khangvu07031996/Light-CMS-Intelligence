var express = require('express');
var router = express.Router();
var app = express();
app.use('/',require('./session'));
app.use('/',require('./user'));
app.use('/',require('./author'));
app.use('/',require('./keyword'));

app.use('/', require('./image'));
// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});

function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		//req.flash('error_msg','You are not logged in');
		res.redirect('/users/login');
	}
}
module.exports = app