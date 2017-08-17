const express = require('express');
const axios = require('axios');

const router = express.Router();
function getArticleById(req, res) {
  const id = req.params.id;
  const urlId = `http://localhost:3000/api/articles/${id}`;
  axios.get(urlId).then((response) => {
    articleId = response.data;
    let arrimage = [];
    arrimage = articleId.images.split(',');

    axios.get('http://localhost:3000/api/articles').then((response) => {
      const allArticle = response.data;
      for (let i = 0; i < allArticle.length; i++) {
        let arr = [];
        arr = allArticle[i].images.split(',');
        allArticle[i].images = arr[0];
      }
      res.render('articleDetail', { data: articleId, arrimage, allData: allArticle ,helpers:{
        image : function(allArticle){
          var x = allArticle.replace("Original", "right");
         // console.log(x);
          return x;
        },
        text : function(data){
          return data.replace(/(<([^>]+)>)/ig,"");
        }
      }});
    });
  });
}
router.get('/detail/:id', getArticleById);
module.exports = router;
