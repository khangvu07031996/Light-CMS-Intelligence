const express = require('express');

const router = express.Router();
const SessionData = require('../models/session');

router.get('/SessionForm', SessionData.getAllSession);
router.post('/new', SessionData.addSession);
router.get('/SessionForm', SessionData.getAllSession);
router.get('/SessionForm/delete/:id', SessionData.deleteSession);
router.post('/SessionForm/edit/:id', SessionData.UpdateSession);
// router.get("/SessionForm/edit/:id",SessionData.UpdateSession);
router.get('/Session/edit/:id', SessionData.getSessionById);
router.get('/add', (req, res) => {
  res.render('addSession');
});
module.exports = router;
