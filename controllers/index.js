const express = require('express');

const app = express();
app.use('/', require('./section'));
app.use('/', require('./user'));
app.use('/', require('./author'));
app.use('/', require('./keyword'));
app.use('/', require('./article'));
app.use('/', require('./images'));

module.exports = app;
