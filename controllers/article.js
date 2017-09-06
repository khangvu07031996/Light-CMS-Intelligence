const express = require('express');
const axios = require('axios');
const variable = require('../config.js');
const multer = require('multer');

const domain = variable.token;
const router = express.Router();

const ArticleData = require('../models/article');
const ArticleController = require('../models/article').Article;
const userdata = require('../models/user');
const Author = require('../models/author');
const section = require('../models/session');
const image = require('../models/image');


const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './publics/img/article_images');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });
// --------------get All article -----------------
function getAllArticle(req, res) {
  const url = `${domain}/api/v1/articles`;
  axios.get(url).then((response) => {
    const data = response.data;
    res.render('ArticleForm', { articles: data });
  });
}
// ----------------add an article ---------------
function addArticle(req, res) {
  const dbArticle = new ArticleController();
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
  dbArticle.status = req.body.status;
  const command = ArticleData.addArticleApi(dbArticle);
  command.then((result, err) => {
    res.redirect('/ArticleForm');
  });
}

function deleteArticle(req, res) {
  ArticleData.deleteArticleApi(req.params.id, (err) => {
    res.redirect('/ArticleForm');
  });
}
function getArticleById(req, res) {
  ArticleData.getArticleByIdApi(req.params.id, (err, data) => {
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
    Author.getAuthorNames((err, dataA) => {
      userdata.getUserNames((err) => {
        section.getSectionNames((err, dataSection) => {
          image.getAll(req, res, (err, rows) => {
            res.render('editArticles', { Author: dataA, Section: dataSection, article: data, images: rows, arr, arrImg });
          });
        });
      });
    });
  });
}
function updateArticle(req, res) {
  ArticleData.getArticleByIdApi(req.params.id, (err, dataArticle) => {
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
      dataArticle.status = req.body.status;
      const command = ArticleData.addArticleApi(dataArticle);
      command.then((result, err) => {
        res.redirect('/ArticleForm');
      });
    }
  });
}
function searchArtical(req, res) {
  const terms = req.body.terms;
  ArticleController.search({ query_string: { query: terms } }, (err, results) => {
    if (err) {
      console.log('failed');
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
router.get('/api/v1/allArticle/:section', ArticleData.getAllArticleBySection);
router.get('/api/v1/articles/:section', ArticleData.getArticleBySection);
router.get('/api/v1/hot_Article/:section', ArticleData.getHotArticleBySection);

function getallName(req, res) {
  Author.getAuthorNames((err, data) => {
    userdata.getUserNames(() => {
      section.getSectionNames((err, dataSection) => {
        image.getAll(req, res, (err, rows) => {
          res.render('addArticles', { Author: data, Section: dataSection, data: rows });
        });
      });
    });
  });
}
router.get('/addArticles', getallName);
module.exports = router;
