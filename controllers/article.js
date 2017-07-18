var express = require('express');
var router = express.Router();
var passport = require('passport');
var ArticleData = require('../models/article');
//add article
router.post("/article", ArticleData.addArticle);
// get all article
router.get("/article", ArticleData.getAllArticle);
// delete article
router.delete("/article/:id", ArticleData.deleteArticle);
//get article by id
router.get("/article/:id", ArticleData.getArticleById);
//update article
router.put("/article/:id",ArticleData.updateArticle);
router.get("/addArticles",function(req,res){
    res.render("addArticles");
})
module.exports = router;