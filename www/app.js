let express = require('express'),
  bodyParser = require('body-parser'),
  router = express.Router(),
  mongoose = require('mongoose');

const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const axios = require('axios');
var handlebars  = require('./helpers/handlebars.js')(exphbs);
app.engine('handlebars', handlebars.engine);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': false }));
app.set('views', path.join(__dirname, '/views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
app.use(express.static(`${__dirname}/publics`));
app.use(require('./router'));
app.get('/demo',function(req,res){
  res.render('articleDetail');
})
app.listen(3030, () => {
  console.log('Listening on port 3030...');
});
