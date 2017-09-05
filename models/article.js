/*eslint-disable*/
const mongoose = require('mongoose');
const section = require('../models/session');
const userdata = require('../models/user');
const Author = require('../models/author');
const mongoosastic = require('mongoosastic');
var image = require('../models/image');

const ArticleSchema = mongoose.Schema({
  headline: {
    type: String,
    es_indexed: true,
  },
  section: {
    type: String,
    es_indexed: true,
  },
  premble: {
    type: String,
    es_indexed: true,
  },
  body: {
    type: String,

  },
  images: {
    type: String,
    es_indexed: true,
  },
  author: {
    type: String,
    es_indexed: true,
  },
  tags: {
    type: String,
    es_indexed: true,
  },
  widgets: {
    type: String,
    es_indexed: true,
  },
  date_created: {
    type: Date,
    default: Date.now,
    es_indexed: true,

  },
  publishDate: {
    type: Date,
    default: Date.now,
    es_indexed: true,
  },
  status: {
    type: String,
    es_indexed: true,
  },
  CreateBy: {
    type: String,
    es_indexed: true,
  },
});
ArticleSchema.plugin(mongoosastic, {
  hosts: 'localhost:9200',
});

const article = module.exports = mongoose.model('Article', ArticleSchema);
article.createMapping((err, mapping) => {
  if (err) {
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  } else {
    console.log('mapping created!');
    console.log(mapping);
  }
});
module.exports = {

  getAllArticle(req, res) {
    let response = {};
    article.find((err, data) => {
      if (err) {
        response = { error: true, message: 'Error deleting data' };
      } else {
        res.render('ArticleForm', { articles: data });
      }
    });
  },
  addArticle(req, res) {
    let response = {};
    const dbArticle = new article();
    dbArticle.headline = req.body.headline;
    dbArticle.section = req.body.section;
    dbArticle.premble = req.body.premble;
    dbArticle.body = req.body.body;
    dbArticle.images = req.body.imgPaths;
    dbArticle.author = req.body.author;
    dbArticle.tags = req.body.tags;
    dbArticle.widgets = req.body.widgets;
    dbArticle.date_created = new Date();
    dbArticle.publishDate = new Date();
    dbArticle.CreateBy = req.body.CreateBy;
    //dbArticle.status = req.body.status;
    console.log("submit = "  + req.body.submit);
    if (req.body.submit == "save") {
      dbArticle.status = "Save Draft";
    } else {
      dbArticle.status = "Published";
    }
    dbArticle.save((err) => {
      if (err) {
        response = { error: true, message: 'Error deleting data' };
      } else {
        res.redirect('/ArticleForm');
      }
    });
  },
  deleteArticle(req, res) {
    let response = {};
    article.findById(req.params.id, (err) => {
      if (err) {
        response = { error: true, message: 'error fetching data' };
      } else {
        article.remove({ _id: req.params.id }, (err) => {
          if (err) {
            response = { error: true, message: 'Error deleting data' };
          } else {
            res.redirect('/ArticleForm');
          }
        });
      }
    });
  },
  getArticleById(req, res) {
    let response = {};
    article.findById({ _id: req.params.id }, (err, data) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        // console.log(data.author);
        // console.log(data.author);
        var arr = [], arrPath = [];
        var arrImg = [], arrLab = [];

        arr = data.author.split(",");
        arrPath = data.images.split(',');

        //Delete item is string empty:
        for (let i = 0; i < arrPath.length; i += 2) {
          if (arrPath[i] == '') {
            arrPath.splice(i, 1);
          }
        }

        for (let i = 0; i < arrPath.length; i += 2) {
          arrImg.push({ id: arrPath[i], src: arrPath[i + 1] });
          arrLab.push({ id: arrPath[i], src: arrPath[i + 1] });
        }
        console.log(data.images);
        console.log('arrImg = ' + arrImg);
        console.log(arrImg);
        console.log(arrPath);
        console.log('---')
        console.log(arrLab);
        Author.getAuthorNames((err, dataA) => {
          userdata.getUserNames((err) => {
            section.getSectionNames((err, dataSection) => {
              image.getAll(req, res, function (err, rows) {
                res.render('editArticles', { Author: dataA, Section: dataSection, article: data, images: rows, arr: arr, arrImg: arrImg });
              });
            });
          });
        });
      }
    });
  },
  updateArticle(req, res) {
    let response = {};
    article.findById(req.params.id, (err, dataArticle) => {
      if (err) {
        response = { error: true, message: 'Error fetching data' };
      } else {
        dataArticle.headline = req.body.headline;
        dataArticle.section = req.body.section;
        dataArticle.premble = req.body.premble;
        dataArticle.body = req.body.body;
        dataArticle.images = req.body.imgPaths;
        dataArticle.author = req.body.author;
        dataArticle.tags = req.body.tags;
        dataArticle.widgets = req.body.widgets;
        dataArticle.date_created = new Date();
        dataArticle.publishDate = new Date();
        dataArticle.CreateBy = req.body.CreateBy;
        dataArticle.status = req.body.status;
        dataArticle.save((err) => {
          if (err) {
            response = { error: true, message: 'Error updating data' };
          } else {
            res.redirect('/ArticleForm');
          }
        });
      }
    });
  },
  searchArtical(req, res) {
    const terms = req.body.terms;
    article.search({ query_string: { query: terms } }, (err, results) => {
      if (err) {
        console.log('failed');
      } else {
        res.render('articleSearch', { articleResult: results.hits.hits });
      }
    });
  },


};
module.exports.getArticleBySection = function (req, res) {
  article.find({ section: req.params.section }, {}, { sort: { date_created: -1 }, limit: 3 }, (err, data) => {
    res.send(data);
  });
};
module.exports.getAllArticleBySection = function (req, res) {
  article.find({ section: req.params.section }, {}, { sort: { date_created: -1 } }, (err, data) => {
    res.send(data);
  });
};
module.exports.getHotArticleBySection = function (req, res) {
  article.findOne({ section: req.params.section }, {}, { sort: { date_created: -1 } }, (err, data) => {
    res.send(data);
  });
};
module.exports.getlastArticle = function (req, res) {
  article.findOne({}, [], { sort: { date_created: -1 }, limit: 8 }, (err, data) => {
    res.send(data);
  });
};
module.exports.getAllArticleApi = function (callback) {
  article.find(callback);
};
module.exports.getArticleByIdApi = function (id, callback) {
  article.findById({ _id: id }, callback);
};
module.exports.addArticleApi = function (articles) {
  return new article(articles).save();
};
module.exports.getHotArticle = function (req, res) {
  article.find({}, [], { sort: { date_created: -1 }, limit: 4 }, (err, data) => {
    res.send(data);
  });
};
module.exports.deleteArticleApi = function (id, callback) {
  article.findById({ _id: id }, (err) => {
    if (!err) {
      article.remove({ _id: id }, callback);
    }
  });
};
module.exports.updateArticleApi = function (req, res) {
  let response = {};
  article.findById(req.params.id, (err, dataArticle) => {
    if (err) {
      response = { error: true, message: 'Error fetching data' };
    } else {
      dataArticle.headline = req.body.headline;
      dataArticle.section = req.body.section;
      dataArticle.premble = req.body.premble;
      dataArticle.body = req.body.body;
      dataArticle.images = req.body.images;
      dataArticle.author = req.body.author;
      dataArticle.tags = req.body.tags;
      dataArticle.widgets = req.body.widgets;
      dataArticle.date_created = new Date(req.body.date_created);
      dataArticle.publishDate = new Date(req.body.publishDate);
      dataArticle.CreateBy = req.body.CreateBy;
      dataArticle.status = req.body.status;
      dataArticle.save((err) => {
        if (err) {
          response = { error: true, message: 'Error updating data' };
        } else {
          res.send('updated');
        }
      });
    }
  });
};
