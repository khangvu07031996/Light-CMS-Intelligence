const express = require('express');

const router = express.Router();
const ArticleData = require('../models/article');
const userdata = require('../models/user');
const Author = require('../models/author');
const section = require('../models/session');
const image = require('../models/image');
const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './publics/img/article_images');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },

});
const upload = multer({ storage });
// add article
router.post('/article/add', upload.single('file'), ArticleData.addArticle);
// get all article
router.get('/ArticleForm', ArticleData.getAllArticle);
// delete article
router.get('/Article/delete/:id', ArticleData.deleteArticle);
// get article by id
router.get('/Article/edit/:id', ArticleData.getArticleById);
// update article
router.post('/Article/edit/:id', ArticleData.updateArticle);
router.post('/Article/search', ArticleData.searchArtical);
router.get('/api/allArticle/:section', ArticleData.getAllArticleBySection);
router.get('/api/Article/:section', ArticleData.getArticleBySection);
router.get('/api/hotArticle/:section', ArticleData.getHotArticleBySection);
// router.get("/demo",ArticleData.getlimitArticle);
function getallName(req, res) {
  Author.getAuthorNames((err, data) => {
    userdata.getUserNames(() => {
      section.getSectionNames((err, dataSection) => {
        image.all(req, res, (rows) => {
          res.render('addArticles', { Author: data, Section: dataSection, data: rows });
        });
      });
    });
  });
}
router.get('/addArticles', getallName);
module.exports = router;
// __++&&&&^^^^^^^^^^^^^
