var express = require('express');
var router = express.Router();
var passport = require('passport');
var keywordData = require('../models/keyword');

router.get('/Keyword/add',function(req,res){
    res.render('addKeyword');
})
router.post('/Keyword/add',keywordData.addKeyWord);
router.get('/Keyword/edit/:id',keywordData.getKeyWordById);
router.post('/Keyword/edit/:id',keywordData.updateKeyWord);
router.get('/KeywordForm',keywordData.getAllKeyWord);
router.get('/Keyword/delete/:id',keywordData.deleteKeyword);
module.exports = router;