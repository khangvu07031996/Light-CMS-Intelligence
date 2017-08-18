const express = require('express');

const app = express();
app.use('/', require('./articles'));

module.exports = app;
