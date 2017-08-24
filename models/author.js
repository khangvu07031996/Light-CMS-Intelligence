const mongoose = require('mongoose');

const AuthorSchema = mongoose.Schema({
  name: {
    type: String,
    index: true,
  },
  dob: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
  },
  active: {
    type: String,
  },
  image: {
    type: String,
  },
  date_update: {
    type: Date,
    default: Date.now,

  },
  date_created: {
    type: Date,
    default: Date.now,
  },

});

const Author = module.exports = mongoose.model('Author', AuthorSchema);
module.exports = {
  addAuthor(req, res) {
    let response = {};
    const AuthorData = new Author();
    AuthorData.name = req.body.name;
    AuthorData.dob = new Date(req.body.dob);
    AuthorData.email = req.body.email;
    AuthorData.active = req.body.active;
    AuthorData.image = req.body.image;
    AuthorData.date_update = new Date(req.body.date_update);
    AuthorData.date_created = new Date(req.body.date_created);
    AuthorData.save((err) => {
      if (err) {
        response = { error: true, message: 'Error adding data' };
      } else {
        res.redirect('/AuthorForm');
      }
    });
  },
  // ------------------getAllAuthor------------------------
  getAllAuthor(req, res) {
    let response = {};
    Author.find((err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        res.render('AuthorForm', { Author: data, helpers:{
          date(data){
            var date = new Date(data)
            var d = date.getDate();
            var mm = date.getMonth() + 1;
            var yyyy = date.getFullYear();
            return d + "/" + mm + "/" + yyyy;
          }

        } });
      }
    });
  },
  // -----------------------getAuthorById-------------------------------
  getAuthorById(req, res) {
    let response = {};
    Author.findById({ _id: req.params.id }, (err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        res.render('editAuthor', { AuthorData: data });
      }
    });
  },
  // ----------------------delete Author--------------------------
  deleteAuthor(req, res) {
    let response = {};
    Author.findById(req.params.id, (err) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        Author.remove({ _id: req.params.id }, (err) => {
          if (err) {
            response = { error: true, message: 'Error deleting data' };
          } else {
            res.redirect('/AuthorForm');
          }
        });
      }
    });
  },
  // --------------------update Author-----------------------
  updateAuthor(req, res) {
    let response = {};
    Author.findById(req.params.id, (err, dataAuthor) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        dataAuthor.name = req.body.name;
        dataAuthor.active = req.body.active;
        dataAuthor.email = req.body.email;
        dataAuthor.dob = new Date(req.body.dob);
        dataAuthor.date_created = new Date(req.body.date_created);
        dataAuthor.date_update = new Date(req.body.date_update);
        dataAuthor.image = req.body.image;
        dataAuthor.save((err) => {
          if (err) {
            console.log('asssssssssssssdsadasdasdsa');
            response = { error: true, message: 'Error deleting data' };
          }
          res.redirect('/AuthorForm');
        });
      }
    });
  },

};
module.exports.getAuthorNames = function (callback) {
  Author.find(callback);
};
