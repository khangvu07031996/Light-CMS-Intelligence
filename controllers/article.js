const express = require('express');
const axios = require('axios');
const variable = require('../config.js');
const multer = require('multer');

const domain = variable.token;
const router = express.Router();

const Article = require('../models/article');
const ArticleScheama = require('../models/article').Article;
const Userdata = require('../models/user');
const Author = require('../models/author');
const Section = require('../models/session');
const Image = require('../models/image');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './publics/img/article_images');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
function getAllArticle(req, res) {
  Article.getArticles((err, data) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      const notFound = new Error('No such data');
      notFound.status = 404;
      errorlog.error(`Error Status : ${notFound.status}`, `Error Message : ${notFound.message}`, `Error Trace : ${new Error().stack}`);
      return next(notFound);
    }
    res.render('ArticleForm', { articles: data,
      helpers: {
        date(data) {
          const date = new Date(data);
          const d = date.getDate();
          const mm = date.getMonth() + 1;
          const yyyy = date.getFullYear();
          return `${d}/${mm}/${yyyy}`;
        },
      } });
  });
}
function addArticle(req, res) {
  const ArticleObj = new ArticleScheama();
  ArticleObj.headline = req.body.headline;
  ArticleObj.section = req.body.section;
  ArticleObj.premble = req.body.premble;
  ArticleObj.body = req.body.body;
  ArticleObj.images = req.body.imgPaths;
  ArticleObj.author = req.body.author;
  ArticleObj.tags = req.body.tags;
  ArticleObj.widgets = req.body.widgets;
  ArticleObj.date_created = new Date();
  ArticleObj.publishDate = new Date(req.body.publishDate);
  ArticleObj.CreateBy = req.body.CreateBy;
  if (req.body.submit === "save") {
    ArticleObj.status = "Draft";
  } else {
    ArticleObj.status = "Published";
  }
  const command = Article.addArticle(ArticleObj);
  command.then((result, err) => {
    res.redirect('/ArticleForm');
  });
}

function deleteArticle(req, res) {
  Article.deleteArticle(req.params.id, (err) => {
    res.redirect('/ArticleForm');
  });
}
function getArticleById(req, res) {
  Article.getArticleById(req.params.id, (err, data) => {
    if (err) {
      throw new Error("Can't get Article");
    }
    let arr = [];
    let arrPath = [];
    const arrImg = [];
    const arrLab = [];
    arr = data.author.split(',');
    arrPath = data.images.split(',');
    for (let i = 0; i < arrPath.length; i += 2) {
      if (arrPath[i] === '') {
        arrPath.splice(i, 1);
      }
    }
    for (let i = 0; i < arrPath.length; i += 2) {
      arrImg.push({ id: arrPath[i], src: arrPath[i + 1] });
      arrLab.push({ id: arrPath[i], src: arrPath[i + 1] });
    }
    Author.getAuthorName((err, dataA) => {
      Userdata.getUserName((err) => {
        Section.getSectionName((err, dataSection) => {
          Image.getAll(req, res, (err, rows) => {
            res.render('editArticles', { Author: dataA, Section: dataSection, article: data, images: rows, arr, arrImg });
          });
        });
      });
    });
  });
}
function updateArticle(req, res) {
  Article.getArticleById(req.params.id, (err, dataArticle) => {
    if (err) {
      throw new Error('Error fetching data');
    } else {
      dataArticle.headline = req.body.headline;
      dataArticle.section = req.body.section;
      dataArticle.premble = req.body.premble;
      dataArticle.body = req.body.body;
      dataArticle.images = req.body.images;
      dataArticle.author = req.body.author;
      dataArticle.tags = req.body.tags;
      dataArticle.widgets = req.body.widgets;
      dataArticle.date_created = new Date();
      dataArticle.publishDate = new Date();
      dataArticle.CreateBy = req.body.CreateBy;
      if (req.body.submit === "save") {
        dataArticle.status = "Draft";
      } else {
        dataArticle.status = "Published";
      }
      const command = Article.addArticle(dataArticle);
      command.then((result, err) => {
        res.redirect('/ArticleForm');
      });
    }
  });
}
function searchArtical(req, res) {
  const terms = req.body.terms;
  ArticleScheama.search({ query_string: { query: terms } }, (err, results) => {
    if (err) {
      throw new Error('Error fetching data');
    } else {
      res.render('articleSearch', { articleResult: results.hits.hits });
    }
  });
}
// add article
router.post('/article/add', upload.single('file'), addArticle);
// get all article
router.get('/articleForm', getAllArticle);
// delete article
router.get('/article/delete/:id', deleteArticle);
// get article by id
router.get('/article/edit/:id', getArticleById);
// update article
router.post('/article/edit/:id', updateArticle);
router.post('/article/search', searchArtical);
router.get('/api/v1/sec-aritcles/:section', Article.getAllArticleBySection);
router.get('/api/v1/article/:section', Article.getArticleBySection);
router.get('/api/v1/hot-article/:section', Article.getHotArticleBySection);

function getAllName(req, res) {
  Author.getAuthorName((err, data) => {
    Userdata.getUserName(() => {
      Section.getSectionName((err, dataSection) => {
        Image.getAll(req, res, (err, rows) => {
          res.render('addArticles', { Author: data, Section: dataSection, data: rows });
        });
      });
    });
  });
}
router.get('/addArticles', getAllName);
module.exports = router;
