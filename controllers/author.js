var express = require('express');
var router = express.Router();
var passport = require('passport');
var multer = require('multer');
var AuthorData = require('../models/author');
var UserData = require('../models/user');
var storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null,'./publics/img');
    },
    filename : function(req,file,cb){
        cb(null,file.originalname);
    }

});
var upload = multer({storage:storage});
//router.post('/author/add',AuthorData.addAuthor);
router.get('/test',function(req,res){
    res.render('demo')
})
router.post('/author/upload',upload.single('file'), function(req,res){
    //console.log(req.file);
    res.send("Upload successful");
})
router.get('/authorForm',function(req,res){
    res.render('authorForm');
},UserData.getUserByIdDone);
router.post("/author",AuthorData.addAuthor );
router.get("/author",AuthorData.getAllAuthor);
//router.get("/author/:id",AuthorData.getAuthorById);
router.get("/author/add",function(req,res){
    res.render('addAuthor');
})
router.delete("/author/:id",AuthorData.deleteAuthor);
router.put("/author/:id",AuthorData.updateAuthor);
module.exports = router;