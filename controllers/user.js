var express = require('express');
var router = express.Router();
var passport = require('passport');
var Userdata = require('../models/user');
var localStrategy = require('passport-local').Strategy;
var userMiddleware = require('../middleware/userMidleware');
router.post('/user', Userdata.addUser);
router.get('/user', Userdata.getAllUser);
router.delete('/delete/:id', Userdata.deleteUser);
router.put('/update/:id', Userdata.updateUser);
router.get('/user/:id', Userdata.getUserByIdDone);
router.post('/register', Userdata.addUser);

// Get Homepage
router.get('/register', ensureAuthenticated2, function (req, res) {
	res.render('register', { layout: false });
});
function ensureAuthenticated2(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} else {
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/404');
	}
}
router.get('/404', function (req, res) {
	res.render('404', { layout: false });
})
router.get('/', userMiddleware.ensureAuthenticated, function (req, res) {
	res.render('index');
});


router.get('/login', function (req, res) {

	res.render('login', { layout: false });
});
router.get('/profile', function (req, res) {

	res.render('profile');
});

passport.use(new localStrategy(function (username, password, done) {
	Userdata.getUserByUsername(username, function (err, user) {
		if (err) throw err;
		if (!user) {
			return done(null, false, { message: 'Unknown User' });
		}
		if (!password.localeCompare(user.password)) {
			return done(null, user);
		} else {
			return done(null, false, { message: 'Invalid password' });
		}
	})
}));
passport.serializeUser(function (user, done) {
	done(null, user.id);
});
passport.deserializeUser(function (id, done) {
	Userdata.getUserById(id, function (err, user) {
		done(err, user);
	})
})
router.get('/logout', function (req, res) {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/login');
});
router.post('/login',
	passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }), function (req, res) {
		res.redirect('/');
		//console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
	})
module.exports = router;