const express = require('express');

const router = express.Router();
const multer = require('multer');
const AuthorData = require('../models/author');
const UserData = require('../models/user');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './publics/img');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },

});
const upload = multer({ storage });

router.post('/author/upload', upload.single('file'), AuthorData.addAuthor);

router.post('/author', AuthorData.addAuthor);
router.get('/authorForm', AuthorData.getAllAuthor, UserData.getUserByIdDone);
router.get('/author/add', (req, res) => {
  res.render('addAuthor');
});
router.get('/Author/edit/:id', AuthorData.getAuthorById);
router.get('/author/delete/:id', AuthorData.deleteAuthor);
router.post('/Author/edit/:id', upload.single('file'), AuthorData.updateAuthor);
module.exports = router;
