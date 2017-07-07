var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var KeywordSchema = mongoose.Schema({
    name :{
        type : String,
        index: true
    }
})
var Keyword = module.exports = mongoose.model('Keyword', KeywordSchema);
module.exports = {
    //------------------addKeyword-------------------------------
    addKeyWord : function(req,res){
        var response = {};
        var KeywordData = new Keyword();
        KeywordData.name = req.body.name;
        KeywordData.save(function(err){
            if(err){
				response = {"error" : true,"message" : "Error adding data"};
			} else {
				response = {"error" : false,"message" : "Data added"};
			}
			res.json(response);
        })
    },
    //---------------------getAllKeyWord----------------------------
    getAllKeyWord : function(req,res){
        var response = {};
        Keyword.find(function(err,data){
             if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
        })
    },
    //--------------------getKeyWordById-------------------------
    getKeyWordById : function(req,res){
        var response = {};
        Keyword.findById({_id : req.params.id},function(err,data){
            if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
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
						response = {"error" : false ,"message" : "Data associated with "+req.params.id+"is deleted"};
					}
					 res.json(response);

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
                dataKeyword.save(function(err){
                    if(err){
                         response = {"error" : true,"message" : "Error deleting data"};
                    } else{
                        response = {"error" : false,"message" : "Data is updated for "+req.params.id};
                    }
                    res.json(response);
                })
            }
        })
    }
}