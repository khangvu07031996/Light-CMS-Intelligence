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
router.get('/', function (req, res) {

    res.render('index');
});
router.get('/login', function (req, res) {

    res.render('login');
});
router.get('/profile', function (req, res) {

    res.render('profile');
});
router.get('/register', function (req, res) {
    res.render('register');
});
module.exports = router;