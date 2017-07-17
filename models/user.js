var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
})
var User = module.exports = mongoose.model('User', UserSchema);
module.exports = {
	// ----------------------add user ------------------------

	addUser: function (req, res) {
		var name = req.body.name;
		var email = req.body.email;
		var username = req.body.username;
		var password = req.body.password;
		var password2 = req.body.password2;
		// Validation
		req.checkBody('name', 'Name is required').notEmpty();
		req.checkBody('email', 'Email is required').notEmpty();
		req.checkBody('email', 'Email is not valid').isEmail();
		req.checkBody('username', 'Username is required').notEmpty();
		req.checkBody('password', 'Password is required').notEmpty();
		req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
		var errors = req.validationErrors();
		if (errors) {
			res.render('register', {
				errors: errors
			},{layout:false});
		} else {
			
			var dbUser = new User();
			dbUser.username = username;
			dbUser.password = password;
			dbUser.email = email;
			dbUser.name = name;
			dbUser.save(function (err) {
				if (err) {
					throw err;
				} else {
					console.log(dbUser);
				}
			});
			req.flash('success_msg', 'You are registered and can now login');
			res.redirect('/login',{layout:false});
		}
	},
	createUser : function(newUser,callback){
		bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
	},
	// ----------------------get All Users -------------------------------
	getAllUser: function (req, res) {
		var response = {};
		User.find(function (err, data) {
			if (err) {
				response = { "error": true, "message": "Error fetching data" };
			} else {
				response = { "error": false, "message": data };
			}
			res.json(response);

		})
	},
	// -----------------getUserById-------------------------------------
	
	getUserByIdDone: function (req, res) {
		var response = {};
		User.findById({ _id: req.params.id }, function (err, data) {
			if (err) {
				response = { "error": true, "message": "Error fetching data" };
			} else {
				res.render('index',{user:data});
				res.send('AuthorForm',{user:data});
			}
			

		})



	},
	//---------------delete User----------------------

	deleteUser: function (req, res) {
		var response = {};
		User.findById(req.params.id, function (err, data) {
			if (err) {
				response = { "error": true, "message": "error fetching data" }
			} else {
				User.remove({ _id: req.params.id }, function () {
					if (err) {
						response = { "error": true, "message": "Error deleting data" };
					} else {
						response = { "error": false, "message": "Data associated with " + req.params.id + "is deleted" };
					}
					res.json(response);
				})
			}
		})
	},
	// -----------------------update user-----------------
	updateUser: function (req, res) {
		var response = {};
		User.findById(req.params.id, function (err, data) {
			if (err) {
				response = { "error": true, "message": "Error fetching data" };
			} else {
				if (req.body.username !== undefined) {
					data.username = req.body.username;
				}
				if (req.body.password !== undefined) {
					data.password = req.body.password;
				}
				if (req.body.email !== undefined) {
					data.email = req.body.email;
				}
				if (req.body.name !== undefined) {
					data.name = req.body.name;
				}
				data.save(function (err) {
					if (err) {
						response = { "error": true, "message": "Error updating data" };

					} else {
						response = { "error": false, "message": "Data is updated for " + req.params.id };
					}
					res.json(response);
				})


			}
		})

	},
	//---------------getUserByUsername--------------
	getUserByUsername: function (username, callback) {
		var query = { username: username };
		User.findOne(query, callback);

	},
	getUserById : function(id,callback){
		User.findById(id,callback);
	},
	//-----------comparePassword--------------------

}
