var express = require('express');
var router = express.Router();
var passport = require('passport');
var Userdata = require('../models/user');
var localStrategy = require('passport-local').Strategy;
	
router.post('/user', Userdata.addUser);
router.get('/user', Userdata.getAllUser);
router.delete('/delete/:id', Userdata.deleteUser);
router.put('/update/:id', Userdata.updateUser);
router.get('/user/:id', Userdata.getUserById);
router.post('/register', Userdata.addUser);
	
// Get Homepage
router.get('/', ensureAuthenticated, function(req, res){
	res.render('index');
});
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('error_msg','You are not logged in');
		res.redirect('/login');
	}
}
router.get('/login', function (req, res) {

    res.render('login');
});
/*router.get('/profile', function (req, res) {

    res.render('profile');
});
*/
router.get('/register', function (req, res) {
    res.render('register');
});
passport.use(new localStrategy( function(username, password, done){
		Userdata.getUserByUsername(username,function(err,user){
			if(err) throw err;
			if(!user){
				return done(null,false, {message:'Unknown User'});
			}
			if(!password.localeCompare(user.password)){
				return done(null, user);
			}else{
				return done(null, false, {message: 'Invalid password'});
			}
		})
	}));
	passport.serializeUser(function(user,done){
		done(null,user.id);
	});
	passport.deserializeUser(function(id,done){
		Userdata.getUserById(id,function(err,user){
			done(err,user);
		})
	})
router.post('/login',
    passport.authenticate('local',{successRedirect:'/',failureRedirect:'/login',failureFlash : true}),function(req,res){
        res.redirect('/');
		//console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    })
module.exports = router;