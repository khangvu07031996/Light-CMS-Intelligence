const express = require('express');
const axios = require('axios');

const router = express.Router();
function getAllArticle(req, res) {
  const url = 'http://localhost:3000/api/hotArticles';
  axios.get(url).then((response) => {
    const dataArticle = response.data;
    for (let i = 0; i < dataArticle.length; i++) {
      let arr = [];
      arr = dataArticle[i].images.split(',');
      dataArticle[i].images = arr[0];
    }
    axios.get('http://localhost:3000/api/lastArticles').then((response) => {
      const lastArticles = response.data;
      let arrLastArticle = [];
      arrLastArticle = lastArticles.images.split(',');
      axios.get('http://localhost:3000/api/Article/Technology').then((response) => {
        const technologyArticle = response.data;
        for (let i = 0; i < technologyArticle.length; i++) {
          let arr = [];
          arr = technologyArticle[i].images.split(',');
          technologyArticle[i].images = arr[0];
        }
        axios.get('http://localhost:3000/api/Article/Education').then((response) => {
          const educationArticle = response.data;
          axios.get('http://localhost:3000/api/Article/Family').then((response) => {
            const faArticle = response.data;
            axios.get('http://localhost:3000/api/Article/World').then((response) => {
              const worldArticle = response.data;
              axios.get('http://localhost:3000/api/Article/Sports').then((response) => {
                const sportArticle = response.data;
                for (let i = 0; i < sportArticle.length; i++) {
                  var arr = [];
                  arr = sportArticle[i].images.split(',');
                  sportArticle[i].images = arr[0];
                }
                res.render('allArticle',
                  { Article: dataArticle, arr, lastArticlesdata: lastArticles, arrLastArticle, tech: technologyArticle, edu: educationArticle, fa: faArticle, world: worldArticle, sport: sportArticle });
              });
            });
          });
        });
      });
    });

  });

}

router.get('/', getAllArticle);
function getTechArticle(req, res) {
  axios.get('http://localhost:3000/api/allArticle/Technology').then((response) => {
    const techArticles = response.data;
    for (let i = 0; i < techArticles.length; i++) {
      let arr = [];
      arr = techArticles[i].images.split(',');
      techArticles[i].images = arr[0];
    }
    axios.get('http://localhost:3000/api/hotArticle/Technology').then((response) => {
      const hotTechArticle = response.data;
      let arrHotArticle = [];
      arrHotArticle = hotTechArticle.images.split(',');
      res.render('technologyArticle', { tech: techArticles, hot: hotTechArticle, arrHotArticle });
    });
  });
}
router.get('/technology', getTechArticle);
function getEduArticle(req, res) {
  axios.get('http://localhost:3000/api/allArticle/Education').then((response) => {
    const eduArticles = response.data;
    for (let i = 0; i < eduArticles.length; i++) {
      let arr = [];
      arr = eduArticles[i].images.split(',');
      eduArticles[i].images = arr[0];
    }
    axios.get('http://localhost:3000/api/hotArticle/Education').then((response) => {
      const hotEduArticle = response.data;
      let arrHotArticle = [];
      arrHotArticle = hotEduArticle.images.split(',');
      res.render('educationArticle', { edu: eduArticles, hot: hotEduArticle, arrHotArticle });
    });
  });
}
router.get('/education', getEduArticle);
function getSpArticle(req, res) {
  axios.get('http://localhost:3000/api/allArticle/Sports').then((response) => {
    const spArticles = response.data;
    for (let i = 0; i < spArticles.length; i++) {
      let arr = [];
      arr = spArticles[i].images.split(',');
      spArticles[i].images = arr[0];
    }
    axios.get('http://localhost:3000/api/hotArticle/Sports').then((response) => {
      const hotSpArticle = response.data;
      let arrHotArticle = [];
      arrHotArticle = hotSpArticle.images.split(',');
      res.render('sportArticles', { sp: spArticles, hot: hotSpArticle, arrHotArticle });
    });
  });
}
router.get('/sport', getSpArticle);
function getWoArticle(req, res) {
  axios.get('http://localhost:3000/api/allArticle/World').then((response) => {
    const woArticles = response.data;
    for (let i = 0; i < woArticles.length; i++) {
      let arr = [];
      arr = woArticles[i].images.split(',');
      woArticles[i].images = arr[0];
    }
    axios.get('http://localhost:3000/api/hotArticle/World').then((response) => {
      const hotWoArticle = response.data;
      let arrHotArticle = [];
      arrHotArticle = hotWoArticle.images.split(',');
      res.render('worldArticle', { wo: woArticles, hot: hotWoArticle, arrHotArticle });
    });
  });
}
router.get('/world', getWoArticle);
function getFaArticle(req, res) {
  axios.get('http://localhost:3000/api/allArticle/Family').then((response) => {
    const faArticles = response.data;
    for (let i = 0; i < faArticles.length; i++) {
      let arr = [];
      arr = faArticles[i].images.split(',');
      faArticles[i].images = arr[0];
    }
    axios.get('http://localhost:3000/api/hotArticle/Family').then((response) => {
      const hotFaArticle = response.data;
      let arrHotArticle = [];
      arrHotArticle = hotFaArticle.images.split(',');
      res.render('familyArticle', { fa: faArticles, hot: hotFaArticle, arrHotArticle });
    });
  });
}
router.get('/family', getFaArticle);
module.exports = router;
