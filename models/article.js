var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var section = require('../models/session');
var userdata = require('../models/user');
var Author = require('../models/author');
var ArticleSchema = mongoose.Schema({
    headline :{
        type : String,
        index : true
    },
    section : {
        type : String,
        
    },
    premble : {
        type : String
    },
    body : {
        type : String
    },
    images :{
        type : String
    },
    author :{
        type : String
    },
    tags : {
        type : String
    },
    widgets : {
        type : String
    },
    date_created :{
        type: Date,
		"default" : Date.now

    },
    publishDate : {
        type: Date,
		"default" : Date.now
    },
    status : {
        type:String
    },
    CreateBy :{
        type : String
    }
})
var article = module.exports = mongoose.model('Article',ArticleSchema);
module.exports = {
    
    getAllArticle : function(req,res){
        var response = {};
        article.find(function(err,data){
            if(err){
                response = {"error" : true,"message" : "Error deleting data"};
            }else{
               res.render('ArticleForm',{articles:data});
            }
            

        })
    },
    addArticle : function(req,res){
        var response = {};
        var dbArticle = new article();
        dbArticle.headline = req.body.headline;
        dbArticle.section = req.body.section;
        dbArticle.premble = req.body.premble;
        dbArticle.body = req.body.body;
        dbArticle.images = req.body.images;
        dbArticle.author = req.body.author;
        dbArticle.tags = req.body.tags;
        dbArticle.widgets = req.body.widgets;
        dbArticle.date_created = new Date(req.body.date_created);
        dbArticle.publishDate = new Date(req.body.publishDate);
        dbArticle.CreateBy = req.body.CreateBy;
        dbArticle.status = req.body.status;
        dbArticle.save(function(err){
            if(err){
                response = {"error" : true,"message" : "Error deleting data"};
            } else {
                res.redirect('/ArticleForm')
            }
             
        })

    },
    deleteArticle : function(req,res){
        var response = {};
        article.findById(req.params.id, function(err){
            if(err){
                response = {"error" : true, "message" : "error fetching data"};
            } else {    
                article.remove({_id:req.params.id},function(err){
                    if(err){
        
						response = {"error" : true,"message" : "Error deleting data"};
                    } else {
                        res.redirect('/ArticleForm')
                    }
                      
                })
            }
        })
    },
    getArticleById : function(req,res){
        var response = {};
        article.findById({_id : req.params.id},function(err,data){
            if(err){
                 response = {"error" : true,"message" : "Error fetching data"};
            } else {
                console.log(data.author);
                var arr = [];
                arr = data.author.split(",");
                Author.getAuthorNames(function(err,dataA){
                userdata.getUserNames(function(err,datauser){
                section.getSectionNames(function(err,dataSection){
                
                 res.render('editArticles',{Author: dataA,Section:dataSection,article:data,arr})
            })
           
        })  
    })
            }
            
        })
    },
    updateArticle : function(req,res){
        var response = {};
        article.findById(req.params.id,function(err,dataArticle){
            if(err){
               response = {"error" : true,"message" : "Error fetching data"};
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
                dataArticle.save(function(err){
                    if(err){
                        response = {"error" : true,"message" : "Error updating data"};
                    } else{
                        res.redirect('/ArticleForm')
                    }
                     
                })
            }
        })
    }


}