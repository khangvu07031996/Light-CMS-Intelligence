var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var AuthorSchema = mongoose.Schema({
	name: {
		type: String,
		index: true
	},
	dob: {
		type: Date,
		"default": Date.now
	},
	email: {
		type: String
	},
	active: {
		type: String
	},
	image: {
		type: String
	},
	date_update: {
		type: Date,
		"default": Date.now

	},
	date_created: {
		type: Date,
		"default": Date.now
	}

})

var Author = module.exports = mongoose.model('Author', AuthorSchema);
module.exports = {
	addAuthor: function (req, res) {
		var response = {};
		var AuthorData = new Author();
		AuthorData.name = req.body.name;
		AuthorData.dob = new Date(req.body.dob);
		AuthorData.email = req.body.email;
		AuthorData.active = req.body.active;
		AuthorData.image = req.body.image;
		AuthorData.date_update = new Date(req.body.date_update);
		AuthorData.date_created = new Date(req.body.date_created);
		AuthorData.save(function (err) {
			if (err) {
				response = { "error": true, "message": "Error adding data" };
			} else {
				res.redirect('/AuthorForm');
			}
		})
	},
	//------------------getAllAuthor------------------------
	getAllAuthor: function (req, res) {
		var response = {};
		Author.find(function (err, data) {
			if (err) {
				response = { "error": true, "message": "Error fetching data" };
			} else {
				res.render('AuthorForm', { Author: data })
			}
		})
	},
	//-----------------------getAuthorById-------------------------------
	getAuthorById: function (req, res) {
		var response = {};
		Author.findById({ _id: req.params.id }, function (err, data) {
			if (err) {
				response = { "error": true, "message": "Error fetching data" };
			} else {
				res.render('editAuthor', { AuthorData: data });
			}

		})
	},
	// ----------------------delete Author--------------------------
	deleteAuthor: function (req, res) {
		var response = {};
		Author.findById(req.params.id, function (err) {
			if (err) {
				response = { "error": true, "message": "Error fetching data" };
			} else {
				Author.remove({ _id: req.params.id }, function (err) {
					if (err) {
						response = { "error": true, "message": "Error deleting data" };
					} else {
						res.redirect('/AuthorForm')
					}

				})
			}
		})
	},
	//--------------------update Author-----------------------
	updateAuthor: function (req, res) {

		var response = {};
		Author.findById(req.params.id, function (err, dataAuthor) {
			if (err) {
				response = { "error": true, "message": "Error fetching data" };
			} else {
					dataAuthor.name = req.body.name;
					dataAuthor.active = req.body.active;
					dataAuthor.email = req.body.email;
					dataAuthor.dob = new Date(req.body.dob);
					dataAuthor.date_created = new Date(req.body.date_created);
					dataAuthor.date_update = new Date(req.body.date_update);
					dataAuthor.image = req.body.image;
				dataAuthor.save(function (err) {
					if (err) {
						console.log("asssssssssssssdsadasdasdsa");
						response = { "error": true, "message": "Error deleting data" };
					} else {

					}
					res.redirect('/AuthorForm')
				})
			}
		})
	}

}