const express = require('express');
const axios = require('axios');
const variable = require('../config.js');

const domain = variable.token;
const router = express.Router();
function getArticleById(req, res) {
  const id = req.params.id;
  const urlId = `${domain}/api/articles/${id}`;
  axios.get(urlId).then((response) => {
    const articleId = response.data;
    let arrimage = [];
    arrimage = articleId.images.split(',');

    axios.get(`${domain}/api/articles`).then((responseAll) => {
      const allArticle = responseAll.data;
      for (let i = 0; i < allArticle.length; i++) {
        let arr = [];
        arr = allArticle[i].images.split(',');
        allArticle[i].images = arr[0];
      }
      res.render('articleDetail', { data: articleId,
        arrimage,
        domain,
        allData: allArticle,
        helpers: {
          image(allArticles) {
            const x = allArticles.replace('Original', 'right');
            // console.log(x);
            return x;
          },
          text(data) {
            return data.replace(/(<([^>]+)>)/ig, '');
          },
        } });
    });
  });
}
router.get('/detail/:id', getArticleById);
module.exports = router;
