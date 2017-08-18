const express = require('express');

const app = express();
app.use('/', require('./article'));
app.use('/', require('./detailArticle'));

module.exports = app;
