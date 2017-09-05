const mongoose = require('mongoose');

const SessionSchema = mongoose.Schema({
  name: {
    type: String,
    index: true,
  },
  descr: {
    type: String,
  },
  date_created: {
    type: Date,
    default: Date.now,
  },
  date_update: {
    type: Date,
    default: Date.now,
  },
});
const Session = module.exports = mongoose.model('Session', SessionSchema);

module.exports = {

  getAllSession(req, res) {
    let response = {};
    Session.find((err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        res.render('SessionForm', { Session: data,
          helpers: {
            date(data) {
              const date = new Date(data);
              const d = date.getDate();
              const mm = date.getMonth() + 1;
              const yyyy = date.getFullYear();
              return `${d}/${mm}/${yyyy}`;
            },
          } });
      }
    });
  },
  addSession(req, res) {
    const dbSession = new Session();
    let response = {};
    dbSession.name = req.body.name;
    dbSession.descr = req.body.descr;
    dbSession.date_created = new Date(req.body.date_created);
    dbSession.date_update = new Date(req.body.date_update);
    dbSession.save((err) => {
      if (err) {
        response = { error: true, message: 'Error adding data' };
      } else {
        res.redirect('/SessionForm');
      }
    });
  },
  // ---------------------deleteSession--------------------
  deleteSession(req, res) {
    let response = {};
    Session.findById(req.params.id, (err) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        Session.remove({ _id: req.params.id }, (err) => {
          if (err) {
            response = { error: true, message: 'Error deleting data' };
          } else {
            res.redirect('/sessionForm');
          }
        });
      }
    });
  },
  getSessionById(req, res) {
    let response = {};
    Session.findById({ _id: req.params.id }, (err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        res.render('editSession', { Sessiondata: data });
      }
    });
  },
  // ---------------------updateSession------------------
  UpdateSession(req, res) {
    let response = {};
    Session.findById(req.params.id, (err, dataSession) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        if (req.body.name !== undefined) {
          dataSession.name = req.body.name;
        }
        if (req.body.descr !== undefined) {
          dataSession.descr = req.body.descr;
        }
        if (req.body.date_created !== undefined) {
          dataSession.date_created = new Date(req.body.date_created);
        }
        if (req.body.date_update !== undefined) {
          dataSession.date_update = new Date(req.body.date_update);
        }
        dataSession.save((err) => {
          if (err) {
            response = { error: true, message: 'Error updating data' };
          }
          res.redirect('/sessionForm');
        });
      }
    });
  },
  getSectionNames(callback) {
    Session.find(callback);
  },
};
