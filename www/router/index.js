const express = require('express');
const router = express.Router();
const app = express();
app.use('/', require('./article'));
app.use('/', require('./detailArticle'));
module.exports = app;
