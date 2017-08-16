let express = require('express');

let router = express.Router();
let passport = require('passport');
let Userdata = require('../models/user');
let localStrategy = require('passport-local').Strategy;
let userMiddleware = require('../middleware/userMidleware');

router.post('/user', Userdata.addUser);
router.get('/user', Userdata.getAllUser);
router.delete('/delete/:id', Userdata.deleteUser);
router.put('/update/:id', Userdata.updateUser);
router.get('/user/:id', Userdata.getUserByIdDone);
router.post('/register', Userdata.addUser);

// Get Homepage
router.get('/register', ensureAuthenticated2, (req, res) => {
	res.render('register', { layout: false });
});
function ensureAuthenticated2(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	} 
		req.flash('error_msg', 'You are not logged in');
		res.redirect('/404');
	
}
router.get('/404', (req, res) => {
	res.render('404', { layout: false });
});
router.get('/', userMiddleware.ensureAuthenticated, (req, res) => {
	res.render('index');
});


router.get('/login', (req, res) => {

	res.render('login', { layout: false });
});
router.get('/profile', (req, res) => {

	res.render('profile');
});

passport.use(new localStrategy(((username, password, done) => {
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
})));
passport.serializeUser((user, done) => {
	done(null, user.id);
});
passport.deserializeUser((id, done) => {
	Userdata.getUserById(id, function (err, user) {
		done(err, user);
	})
});
router.get('/logout', (req, res) => {
	req.logout();

	req.flash('success_msg', 'You are logged out');

	res.redirect('/login');
});
router.post('/login',
  passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }), (req, res) => {
		res.redirect('/');
		//console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
	});
module.exports = router;
