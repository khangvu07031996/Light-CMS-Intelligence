var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var fs = require('fs');
var AuthorSchema = mongoose.Schema({
    name :{
        type : String,
        index: true
    },
    dob:{
        type: Date,
		"default" : Date.now
    },
    email: {
		type: String
	},
	active: {
		type: String
	},
	image: {
		type: String
	},
	date_update: {
		type: Date,
		"default" : Date.now
	
	},
	date_created: {
		type: Date,
		"default" : Date.now
	}
	
})

var Author = module.exports = mongoose.model('Author', AuthorSchema);
module.exports = {
	addAuthor : function(req,res){
		var response = {};
		var AuthorData = new Author();
		AuthorData.name = req.body.name;
		AuthorData.dob = new Date(req.body.dob);
		AuthorData.email = req.body.email;
		AuthorData.active = req.body.active;
		AuthorData.image = req.body.image;
		
		AuthorData.date_update = new Date(req.body.date_update);
		AuthorData.date_created = new Date(req.body.date_created);
		AuthorData.save(function(err){
			if(err){
				response = {"error" : true,"message" : "Error adding data"};
			} else {
				response = {"error" : false,"message" : "Data added"};
			}
			res.json(response);
		})
	},
	//------------------getAllAuthor------------------------
	getAllAuthor : function(req,res){
		var response = {};
		Author.find(function(err,data){
			 if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
		})
	},
	//-----------------------getAuthorById-------------------------------
	getAuthorById : function(req,res){
		var response = {};
		Author.findById({_id : req.params.id},function(err,data){
			if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);
		})
	},
	// ----------------------delete Author--------------------------
	deleteAuthor : function(req,res){
		var response = {};
		Author.findById(req.params.id,function(err){
			if(err){
				response = {"error" : true,"message" : "Error fetching data"};
			} else {
				Author.remove({_id: req.params.id},function(err){
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
	//--------------------update Author-----------------------
	updateAuthor : function(req,res){
		var response = {};
		Author.findById(req.params.id,function(err,dataAuthor){
			if(err){
				response = {"error" : true,"message" : "Error fetching data"};
			} else {
				if(req.body.name !== undefined){
					dataAuthor.name = req.body.name;
				}
				if(req.body.active !== undefined){
					dataAuthor.active = req.body.active;
				}
				if(req.body.email !== undefined){
					dataAuthor.email = req.body.email;
				}
				if(req.body.date_created !== undefined){
					dataAuthor.date_created = new Date(req.body.date_created);
				}
				if(req.body.date_update !== undefined){
					dataAuthor.date_update = new Date(req.body.date_update);
				}
				dataAuthor.image = req.body.image;
			
				dataAuthor.save(function(err){
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