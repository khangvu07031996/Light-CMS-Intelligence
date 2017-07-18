var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var KeywordSchema = mongoose.Schema({
    name :{
        type : String,
        index: true
    },
    date_update: {
		type: Date,
		"default": Date.now

    },
    date_created: {
		type: Date,
		"default": Date.now
	}
})
var Keyword = module.exports = mongoose.model('Keyword', KeywordSchema);
module.exports = {
    //------------------addKeyword-------------------------------
    addKeyWord : function(req,res){
        var response = {};
        var KeywordData = new Keyword();
        KeywordData.name = req.body.name;
        KeywordData.date_created = new Date(req.body.date_created);
        KeywordData.date_update = new Date(req.body.date_update);
        KeywordData.save(function(err){
            if(err){
				response = {"error" : true,"message" : "Error adding data"};
			} else {
				res.redirect('/keywordForm');
			}
			
        })
    },
    //---------------------getAllKeyWord----------------------------
    getAllKeyWord : function(req,res){
        var response = {};
        Keyword.find(function(err,data){
             if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                res.render('keywordForm',{keyword:data});
            }
           
        })
    },
    //--------------------getKeyWordById-------------------------
    getKeyWordById : function(req,res){
        var response = {};
        Keyword.findById({_id : req.params.id},function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                res.render('editKeyword',{keyword:data})
            }
            
        })
    },
    //-----------------------------deleteKeyWord---------------------
    deleteKeyword : function(req,res){
        var response = {};
        Keyword.findById(req.params.id,function(err){
            if(err){
              response = {"error" : true,"message" : "Error fetching data"};  
            } else {
                Keyword.remove({_id:req.params.id},function(err){
                    if(err){
						response = {"error" : true,"message" : "Error deleting data"};
					} else {
						res.redirect('/keywordForm')
					}
					 
                })
            }
        })
    },
    //--------------------------updateKeyWord--------------------
    updateKeyWord: function(req,res){
        var response = {};
        Keyword.findById(req.params.id,function(err,dataKeyword){
            if(err){
                response = {"error" : true,"message" : "Error deleting data"};
            } else {
                if(req.body.name !== undefined){
                    dataKeyword.name = req.body.name;
                }
                dataKeyword.date_created = req.body.date_created;
                dataKeyword.date_update = req.body.date_update;
                dataKeyword.save(function(err){
                    if(err){
                         response = {"error" : true,"message" : "Error deleting data"};
                    } else{
                      res.redirect('/keywordForm');
                    }
                    
                })
            }
        })
    }
}