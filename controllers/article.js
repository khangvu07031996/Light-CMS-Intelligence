var express = require('express');
var router = express.Router();
var passport = require('passport');
var ArticleData = require('../models/article');
var userdata = require('../models/user');
var Author = require('../models/author');
var section = require('../models/session');
var multer = require('multer');
var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./publics/img/article_images');
    },
    filename : function(req,file,cb){
        cb(null,file.originalname);
    }

});
var upload = multer({storage:storage});
//add article
router.post("/article/add",upload.single('file'),ArticleData.addArticle);
// get all article
router.get("/ArticleForm", ArticleData.getAllArticle);
// delete article
router.get("/Article/delete/:id", ArticleData.deleteArticle);
//get article by id
router.get("/Article/edit/:id",ArticleData.getArticleById);
//update article
router.post("/Article/edit/:id",ArticleData.updateArticle);
function getallName(req,res){
    Author.getAuthorNames(function(err,data){
        userdata.getUserNames(function(err,datauser){
            section.getSectionNames(function(err,dataSection){
                
                 res.render('addArticles',{Author: data,Section:dataSection})
            })
           
        })  
    })
      
    
}
router.get("/addArticles",getallName)
module.exports = router;