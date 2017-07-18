var express = require('express');
var router = express.Router();
var passport = require('passport');
var SessionData = require('../models/session');
router.get('/SessionForm',SessionData.getAllSession);
router.post("/new", SessionData.addSession);
router.get("/SessionForm", SessionData.getAllSession);
router.get("/SessionForm/delete/:id", SessionData.deleteSession);
router.post("/SessionForm/edit/:id", SessionData.UpdateSession);
//router.get("/SessionForm/edit/:id",SessionData.UpdateSession);
router.get("/Session/edit/:id", SessionData.getSessionById);
router.get("/add",function(req,res){
    res.render('addSession');
});
module.exports = router;