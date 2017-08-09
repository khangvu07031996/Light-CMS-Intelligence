var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var section = require('../models/session');
var userdata = require('../models/user');
var Author = require('../models/author');
var image = require('../models/image');
var mongoosastic = require('mongoosastic');
var ArticleSchema = mongoose.Schema({
    headline :{
        type : String,
        es_indexed : true
    },
    section : {
        type : String,
        es_indexed : true
    },
    premble : {
        type : String,
        es_indexed : true
    },
    body : {
        type : String
        
    },
    images :{
        type : String,
       es_indexed : true
    },
    author :{
        type : String,
       es_indexed : true
    },
    tags : {
        type : String,
       es_indexed : true
    },
    widgets : {
        type : String,
        es_indexed : true
    },
    date_created :{
        type: Date,
        "default" : Date.now,
        es_indexed : true

    },
    publishDate : {
        type: Date,
        "default" : Date.now,
       es_indexed : true
    },
    status : {
        type:String,
        es_indexed : true
    },
    CreateBy :{
        type : String,
        es_indexed : true
    }
})
ArticleSchema.plugin(mongoosastic,{
        hosts : 'localhost:9200'
}); 
 
var article = module.exports = mongoose.model('Article',ArticleSchema);
article.createMapping(function(err, mapping){
  if(err){
    console.log('error creating mapping (you can safely ignore this)');
    console.log(err);
  }else{
    console.log('mapping created!');
    console.log(mapping);
  }
});
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
        dbArticle.images = req.body.imgPaths;
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
    getArticleById: function (req, res) {
        var response = {};
        article.findById({ _id: req.params.id }, function (err, data) {
            if (err) {
                response = { "error": true, "message": "Error fetching data" };
            } else {
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
                    arrImg.push({id: arrPath[i], src: arrPath[i+1]});
                    arrLab.push({id: arrPath[i], src: arrPath[i+1]});
                }
                console.log(data.images);
                console.log('arrImg = ' + arrImg);
                console.log(arrImg);
                console.log(arrPath);
                console.log('---')
                console.log(arrLab);
				
                Author.getAuthorNames(function (err, dataA) {
                    userdata.getUserNames(function (err, datauser) {
                        section.getSectionNames(function (err, dataSection) {

                            //res.render('editArticles', { Author: dataA, Section: dataSection, article: data, arr })
							image.getAll(req, res, function(err, rows) {                
								res.render('editArticles', { Author: dataA, Section: dataSection, article: data, images: rows, arr: arr, arrImg: arrImg});
							});
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
                dataArticle.images = req.body.imgPaths;
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
    }, 
    searchArtical : function(req,res){
        
       var terms = req.body.terms;
       article.search({query_string : {query:terms}} ,function(err,results){
           if(err){
               console.log("failed")
           } else {
            res.render('articleSearch',{articleResult:results.hits.hits})
           }
            
       })
    }


}