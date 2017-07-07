var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var passport  = require('passport');
var localStrategy = require('passport-local').Strategy;
var UserSchema = mongoose.Schema({
    username :{
        type : String,
        index: true
    },
    password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
})
var User = module.exports = mongoose.model('User', UserSchema);
module.exports = {
	// ----------------------add user ------------------------
	addUser: function(req,res){
		var dbUser = new User();
		var response = {};
		dbUser.username = req.body.username;
		dbUser.password = 	require('crypto')
							.createHash('sha1')
							.update(req.body.password)
							.digest('base64');
		dbUser.email = req.body.email;
		dbUser.name = req.body.name;
		// Validation 
		//req.checkBody('name', 'Name is required').notEmpty();
		//req.checkBody('email', 'Email is required').notEmpty();

		dbUser.save(function(err){
			if(err){
				response = {"error" : true,"message" : "Error adding data"};
			} else {
				response = {"error" : false,"message" : "Data added"};
			}
			res.json(response);
		});		
	}, 
	 // ----------------------get All Users -------------------------------
	getAllUser: function(req,res){
		var response = {};
		User.find(function(err,data){
			 if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);

		})
	},
	// -----------------getUserById-------------------------------------
	getUserById: function(req,res){
		var response = {};
		User.findById({_id : req.params.id},function(err,data){
			 if(err) {
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
                response = {"error" : false,"message" : data};
            }
            res.json(response);

		})

		

	},
	//---------------delete User----------------------
	deleteUser: function(req,res){
		var response = {};
		User.findById(req.params.id,function(err,data){
			if(err){
				response = {"error" : true ,"message" :"error fetching data" }
			} else {
				User.remove({_id:req.params.id},function(){
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
	// -----------------------update user-----------------
	updateUser: function(req,res){
		var response = {};
		User.findById(req.params.id,function(err,data){
			if(err){
				response = {"error" : true,"message" : "Error fetching data"};
			} else {
				if(req.body.username !== undefined){
					data.username = req.body.username;
				}
				if(req.body.password !== undefined){
					data.password = req.body.password;
				}
				if(req.body.email !== undefined){
					data.email = req.body.email;
				}
				if(req.body.name !== undefined){
					data.name = req.body.name;
				}
				data.save(function(err){
					if(err){
						response = {"error" : true,"message" : "Error updating data"};

					} else {
						response = {"error" : false,"message" : "Data is updated for "+req.params.id};
					}
					 res.json(response);
				})

				
			}
		})

	},
	//---------------getUserByUsername--------------
	getUserByUsername : function (username,callback){
		var query = {username:username};
		User.findOne(query,callback);

	},
	//-----------comparePassword--------------------
	comparePassword :function(candicatePassword,hash,callback){
		bcrypt.compare(candicatePassword,hash,function(err,isMath){
			if(err) throw err;
			callback(null,isMath);
		})
	}

}