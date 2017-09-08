const mongoose = require('mongoose');

const KeywordSchema = mongoose.Schema({
  name: {
    type: String,
    index: true,
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
const Keyword = module.exports = mongoose.model('Keyword', KeywordSchema);
module.exports = {
  // ------------------addKeyword-------------------------------
  addKeyWord(req, res) {
    let response = {};
    const KeywordData = new Keyword();
    KeywordData.name = req.body.name;
    KeywordData.date_created = new Date(req.body.date_created);
    KeywordData.date_update = new Date(req.body.date_update);
    KeywordData.save((err) => {
      if (err) {
        response = { error: true, message: 'Error adding data' };
      } else {
        res.redirect('/keywordForm');
      }
    });
  },
  // ---------------------getAllKeyWord----------------------------
  getAllKeyWord(req, res) {
    let response = {};
    Keyword.find((err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        res.render('keywordForm', { keyword: data,
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
  // --------------------getKeyWordById-------------------------
  getKeyWordById(req, res) {
    let response = {};
    Keyword.findById({ _id: req.params.id }, (err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        res.render('editKeyword', { keyword: data });
      }
    });
  },
  // -----------------------------deleteKeyWord---------------------
  deleteKeyword(req, res) {
    let response = {};
    Keyword.findById(req.params.id, (err) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        Keyword.remove({ _id: req.params.id }, (err) => {
          if (err) {
            response = { error: true, message: 'Error deleting data' };
          } else {
            res.redirect('/keywordForm');
          }
        });
      }
    });
  },
  // --------------------------updateKeyWord--------------------
  updateKeyWord(req, res) {
    let response = {};
    Keyword.findById(req.params.id, (err, dataKeyword) => {
      if (err) {
        response = { error: true, message: 'Error deleting data' };
      } else {
        if (req.body.name !== undefined) {
          dataKeyword.name = req.body.name;
        }
        dataKeyword.date_created = req.body.date_created;
        dataKeyword.date_update = req.body.date_update;
        dataKeyword.save((err) => {
          if (err) {
            response = { error: true, message: 'Error deleting data' };
          } else {
            res.redirect('/keywordForm');
          }
        });
      }
    });
  },
};
