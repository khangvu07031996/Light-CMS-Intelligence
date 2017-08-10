var express = require('express'),
  bodyParser = require('body-parser'),
  router = express.Router(),
  mongoose = require('mongoose');
var app = express();
var fetch = require('node-fetch');
var exphbs = require('express-handlebars');
var path = require('path');
var axios = require('axios');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
app.set('views', path.join(__dirname, '/views'));
app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
app.set('view engine', 'handlebars');
app.use(express.static(__dirname + '/publics'))


function getAllArticle(req, res) {
  const url = 'http://localhost:3000/api/articles'
  axios.get(url).then(function (response) {
    var dataArticle = response.data;
    for (var i = 0; i < dataArticle.length; i++) {
      var arr = [];
      arr = dataArticle[i].images.split(",");
      dataArticle[i].images = arr[0];
    }
    axios.get('http://localhost:3000/api/lastArticles').then(function(response){
        var lastArticles = response.data;
        var arrLastArticle = [];
        arrLastArticle = lastArticles.images.split(",");
      res.render('allArticle', { Article: dataArticle, arr ,lastArticlesdata :lastArticles, arrLastArticle});
    })
    
  })
 
}
app.get('/', getAllArticle);
// get article by id
function getArticleById(req, res) {
  var id = req.params.id;
  var urlId = "http://localhost:3000/api/articles/" + id;
  axios.get(urlId).then(function (response) {
    articleId = response.data;
    var arrimage = [];
    arrimage = articleId.images.split(",");
    res.render('articleDetail', { data: articleId,arrimage })
  })
}
app.get('/detail/:id', getArticleById);

app.listen(3030, function () {
  console.log('Listening on port 3030...')
})