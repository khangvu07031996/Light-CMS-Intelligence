const mongoose = require('mongoose');
const section = require('../models/session');
const userdata = require('../models/user');
const Author = require('../models/author');
const mongoosastic = require('mongoosastic');
const image = require('../models/image');
let mongoosePaginate = require('mongoose-paginate');

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
  dateCreated: {
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
    default: 'Save Draft',
  },
  createBy: {
    type: String,
    es_indexed: true,
  },
});
ArticleSchema.plugin(mongoosastic, {
  hosts: 'localhost:9200',
});
ArticleSchema.plugin(mongoosePaginate);

const Article = module.exports = mongoose.model('Article', ArticleSchema);
Article.createMapping((err, mapping) => {
  if (err) {
    console.log(err);
  } else {
    console.log('mapping created!');
    console.log(mapping);
  }
});
module.exports = {
  Article,
};
module.exports.getArticleBySection = function (req, res) {
  Article.find({ section: req.params.section, status: 'Published' },
    {}, { sort: { dateCreated: -1 }, limit: 3 }, (err, data) => {
      res.send(data);
    });
};
module.exports.getAllArticleBySection = function (req, res) {
  Article.find({ section: req.params.section, status: 'Published' }, {}, { sort: { dateCreated: -1 } }, (err, data) => {
    res.send(data);
  });
};
module.exports.getHotArticleBySection = function (req, res) {
  Article.findOne({ section: req.params.section, status: 'Published' }, {},
    { sort: { dateCreated: -1 } }, (err, data) => {
      res.send(data);
    });
};
module.exports.getLastArticle = function (req, res) {
  Article.findOne({ status: 'Published' }, [], { sort: { dateCreated: -1 }, limit: 8 }, (err, data) => {
    res.send(data);
  });
};
module.exports.getArticles = function (callback) {
  Article.find(callback);
};
module.exports.getPublishedArticles = function (callback) {
  Article.find({ status: 'Published' }, callback);
};
module.exports.getArticleById = function (id, callback) {
  Article.findById({ _id: id }, callback);
};
module.exports.addArticle = function (articles) {
  return new Article(articles).save();
};
module.exports.getHotArticle = function (req, res) {
  Article.find({ status: 'Published' }, [], { sort: { dateCreated: -1 }, limit: 4 }, (err, data) => {
    res.send(data);
  });
};
module.exports.deleteArticle = function (id, callback) {
  Article.findById({ _id: id }, (err) => {
    if (!err) {
      Article.remove({ _id: id }, callback);
    }
  });
};
module.exports.updateArticle = function (req, res) {
  Article.findById(req.params.id, (err, dataArticle) => {
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
      dataArticle.dateCreated = new Date();
      dataArticle.publishDate = new Date(req.body.publishDate);
      dataArticle.createBy = req.body.createBy;
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
