var express = require('express');
var router = express.Router();
var passport = require('passport');
var ArticleData = require('../models/article');
var userdata = require('../models/user');
var Author = require('../models/author');
var section = require('../models/session');
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
function getallName(req,res){
    Author.getAuthorNames(function(err,data){
        userdata.getUserNames(function(err,datauser){
            section.getSectionNames(function(err,dataSection){
                
                 res.render('addArticles',{user:datauser, Author: data,Section:dataSection})
            })
           
        })  
    })
      
    
}
router.get("/addArticles",getallName)
module.exports = router;