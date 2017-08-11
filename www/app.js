var express = require('express'),
  bodyParser = require('body-parser'),
  router = express.Router(),
  mongoose = require('mongoose');
var app = express();
var exphbs = require('express-handlebars');
var path = require('path');
var axios = require('axios');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
app.set('views', path.join(__dirname, '/views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/publics'))
app.use(require('./router'))
app.listen(3030, function () {
  console.log('Listening on port 3030...')
})