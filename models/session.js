var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var SessionSchema = mongoose.Schema({
    name :{
        type : String,
        index: true
    },
    descr: {
		type: String
	},
	date_created: {
		type: Date,
		"default" : Date.now
	},
	date_update: {
		type: Date,
		"default" : Date.now
	}
})
var Session = module.exports = mongoose.model('Session', SessionSchema);

module.exports = {
	
	getAllSession : function(req,res){
		var response = {};
		Session.find(function(err,data){
			 if(err) {
				console.log("getAll");
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
				
               res.render('SessionForm',{Session:data});
            }
           
		})
	},
	addSession: function(req,res){
		var dbSession  = new Session(); 
		var response = {};
		dbSession.name = req.body.name;
		dbSession.descr = req.body.descr;
		dbSession.date_created = new Date(req.body.date_created) ;
		dbSession.date_update = new Date(req.body.date_update);
		dbSession.save(function(err){
			if(err){
				console.log("add");
				response = {"error" : true,"message" : "Error adding data"};
			} else {
				res.redirect('/SessionForm');
			}
			
		})
	},
	//---------------------deleteSession--------------------
	deleteSession : function(req,res){
		var response = {};
		Session.findById(req.params.id,function(err){
			if(err){
				 response = {"error" : true,"message" : "Error fetching data"};
			} else {
				Session.remove({_id:req.params.id},function(err){
					if(err){
						console.log("delete");
						response = {"error" : true,"message" : "Error deleting data"};
					} else {
						
						res.redirect('/sessionForm');
					}

					
				})
			}
		})

	},
	getSessionById : function(req,res){
		var response = {};
		Session.findById({_id : req.params.id}, function(err,data){
			 if(err) {
				
                response = {"error" : true,"message" : "Error fetching data"};
            } else {
				res.render('editSession',{Sessiondata:data})
               
            }
          
		})
	},
	// ---------------------updateSession------------------
	UpdateSession : function(req,res){
		var response = {};
		Session.findById(req.params.id,function(err,dataSession){
			if(err){
				console.log("update");
				response = {"error" : true,"message" : "Error fetching data"};
			} else {
				if(req.body.name !== undefined){
					dataSession.name = req.body.name;
				}
				if(req.body.descr !== undefined){
					dataSession.descr = req.body.descr;
				}
				if(req.body.date_created !== undefined){
					dataSession.date_created = new Date(req.body.date_created);
				}
				if(req.body.date_update !== undefined){
					dataSession.date_update = new Date(req.body.date_update);
				}
				dataSession.save(function(err){
					if(err){
						response = {"error" : true,"message" : "Error updating data"};

					} else {
						
					}
					res.redirect('/sessionForm');
				})
			}
		})
	}

}