var express = require('express');
var axios = require('axios');
var router = express.Router();
function getArticleById(req, res) {
    var id = req.params.id;
    var urlId = "http://localhost:3000/api/articles/" + id;
    axios.get(urlId).then(function (response) {
        articleId = response.data;
        var arrimage = [];
        arrimage = articleId.images.split(",");
       axios.get('http://localhost:3000/api/articles').then(function (response) {
             var allArticle = response.data;
                for(var i = 0 ; i < allArticle.length; i ++){
                    var arr = [];
                    arr = allArticle[i].images.split(",");
                    allArticle[i].images = arr[0];
                }
            res.render('articleDetail', { data: articleId, arrimage, allData : allArticle });
        })
    })
}
router.get('/detail/:id', getArticleById);
module.exports = router;