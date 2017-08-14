var express = require('express');
var axios = require('axios');
var router = express.Router();
function getAllArticle(req, res) {
  const url = 'http://localhost:3000/api/hotArticles'
  axios.get(url).then(function (response) {
    var dataArticle = response.data;
    for (var i = 0; i < dataArticle.length; i++) {
      var arr = [];
      arr = dataArticle[i].images.split(",");
      dataArticle[i].images = arr[0];
    }
    axios.get('http://localhost:3000/api/lastArticles').then(function (response) {
      var lastArticles = response.data;
      var arrLastArticle = [];
      arrLastArticle = lastArticles.images.split(",");
      axios.get('http://localhost:3000/api/Article/Technology').then(function (response) {
        var technologyArticle = response.data;
        axios.get('http://localhost:3000/api/Article/Education').then(function (response) {
          var educationArticle = response.data;
          axios.get('http://localhost:3000/api/Article/Family').then(function (response) {
            var faArticle = response.data;
            axios.get('http://localhost:3000/api/Article/World').then(function (response) {
              var worldArticle = response.data;
              res.render('allArticle',
                { Article: dataArticle, arr, lastArticlesdata: lastArticles, arrLastArticle, tech: technologyArticle, edu: educationArticle, fa: faArticle ,world:worldArticle});
            })
          })
        })
      })
    })

  })

}

router.get('/', getAllArticle);
module.exports = router;