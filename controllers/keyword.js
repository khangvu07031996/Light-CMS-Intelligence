const express = require('express');

const router = express.Router();
const passport = require('passport');
const keywordData = require('../models/keyword');

router.get('/Keyword/add', (req, res) => {
  res.render('addKeyword');
});
router.post('/Keyword/add', keywordData.addKeyWord);
router.get('/Keyword/edit/:id', keywordData.getKeyWordById);
router.post('/Keyword/edit/:id', keywordData.updateKeyWord);
router.get('/KeywordForm', keywordData.getAllKeyWord);
router.get('/Keyword/delete/:id', keywordData.deleteKeyword);
module.exports = router;
