const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true,
  },
  password: {
    type: String,
  },
  email: {
    type: String,
  },
  name: {
    type: String,
  },
});
const User = module.exports = mongoose.model('User', UserSchema);
module.exports = {
  // ----------------------add user ------------------------
  addUser(req, res) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    // Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
    const errors = req.validationErrors();
    if (errors) {
      res.render('register', {
        errors,
      });
    } else {
      const dbUser = new User();
      dbUser.username = username;
      dbUser.password = password;
      dbUser.email = email;
      dbUser.name = name;
      dbUser.save((err) => {
        if (err) {
          throw err;
        } else {
          console.log(dbUser);
        }
      });
      req.flash('success_msg', 'You are registered and can now login');
      res.redirect('/login');
    }
  },
  createUser(newUser, callback) {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        newUser.password = hash;
        newUser.save(callback);
      });
    });
  },
  // ----------------------get All Users -------------------------------
  getAllUser(req, res) {
    let response = {};
    User.find((err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        res.render('addArticles', { user: data });
      }
    });
  },
  // -----------------getUserById-------------------------------------

  getUserByIdDone(req, res) {
    let response = {};
    User.findById({ _id: req.params.id }, (err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        // res.render('layout',{user:data});
        res.render('addArticles', { user: data });
      }
    });
  },
  // ---------------delete User----------------------

  deleteUser(req, res) {
    let response = {};
    User.findById(req.params.id, (err, data) => {
      if (err) {
        response = { error: true, message: 'error fetching data' };
      } else {
        User.remove({ _id: req.params.id }, () => {
          if (err) {
            response = { error: true, message: 'Error deleting data' };
          } else {
            response = { error: false, message: `Data associated with ${req.params.id}is deleted` };
          }
          res.json(response);
        });
      }
    });
  },
  // -----------------------update user-----------------
  updateUser(req, res) {
    let response = {};
    User.findById(req.params.id, (err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
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
        data.save((err) => {
          if (err) {
            response = { error: true, message: 'Error updating data' };
          } else {
            response = { error: false, message: `Data is updated for ${req.params.id}` };
          }
          res.json(response);
        });
      }
    });
  },
  // ---------------getUserByUsername--------------
  getUserByUsername(username, callback) {
    const query = { username };
    User.findOne(query, callback);
  },
  getUserById(id, callback) {
    User.findById(id, callback);
  },
  // -----------comparePassword--------------------

};
module.exports.getUserName = function (callback) {
  User.find(callback);
};
