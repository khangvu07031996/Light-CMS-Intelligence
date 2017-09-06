const express = require('express');
const axios = require('axios');

const router = express.Router();
const variable = require('../config.js');

const domain = variable.token;
function getAllArticle(req, res) {
  const url = `${domain}/api/v1/hot_Articles`;
  axios.get(url).then((response) => {
    const dataArticle = response.data;
    for (let i = 0; i < dataArticle.length; i++) {
      let arr = [];
      arr = dataArticle[i].images.split(',');
      dataArticle[i].images = arr[1];
    }
    axios.get(`${domain}/api/v1/last_Articles`).then((responseLast) => {
      const lastArticles = responseLast.data;
      let arrLastArticle = [];
      arrLastArticle = lastArticles.images.split(',');
      // get only path:
      const arrtemp = [];
      for (let j = 1; j < arrLastArticle.length; j += 2) {
        arrtemp.push(arrLastArticle[j]);
      }
      arrLastArticle = arrtemp;
      axios.get(`${domain}/api/v1/articles/Technology`).then((responseTech) => {
        const technologyArticle = responseTech.data;
        for (let i = 0; i < technologyArticle.length; i++) {
          let arr = [];
          arr = technologyArticle[i].images.split(',');
          technologyArticle[i].images = arr[1];
        }
        axios.get(`${domain}/api/v1/articles/Education`).then((responseEdu) => {
          const educationArticle = responseEdu.data;
          for (let i = 0; i < educationArticle.length; i++) {
            let arr = [];
            arr = educationArticle[i].images.split(',');
            educationArticle[i].images = arr[1];
          }
          axios.get(`${domain}/api/v1/articles/Family`).then((responseFa) => {
            const faArticle = responseFa.data;
            for (let i = 0; i < faArticle.length; i++) {
              let arr = [];
              arr = faArticle[i].images.split(',');
              faArticle[i].images = arr[1];
            }
            axios.get(`${domain}/api/v1/articles/World`).then((responseWo) => {
              const worldArticle = responseWo.data;
              for (let i = 0; i < worldArticle.length; i++) {
                let arr = [];
                arr = worldArticle[i].images.split(',');
                worldArticle[i].images = arr[1];
              }
              axios.get(`${domain}/api/v1/articles/Sports`).then((responseSp) => {
                let arr = [];
                const sportArticle = responseSp.data;
                for (let i = 0; i < sportArticle.length; i++) {
                  arr = sportArticle[i].images.split(',');
                  sportArticle[i].images = arr[1];
                }
                res.render('allArticle',
                  { Article: dataArticle,
                    arr,
                    lastArticlesdata: lastArticles,
                    arrLastArticle,
                    tech: technologyArticle,
                    edu: educationArticle,
                    fa: faArticle,
                    world: worldArticle,
                    sport: sportArticle,
                    helpers: {
                      imageResize(educationArticle) {
                        const temp = educationArticle.replace('Original', '390x240');
                        return temp;
                      },
                    },
                  });
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
  axios.get(`${domain}/api/v1/allArticle/Technology`).then((response) => {
    const techArticles = response.data;
    for (let i = 0; i < techArticles.length; i++) {
      let arr = [];
      arr = techArticles[i].images.split(',');
      techArticles[i].images = arr[1];
    }
    axios.get(`${domain}/api/v1/hot_Article/Technology`).then((responseHotTech) => {
      const hotTechArticle = responseHotTech.data;
      let arrHotArticle = [];
      arrHotArticle = hotTechArticle.images.split(',');
      const arrtemp = [];
      for (let j = 1; j < arrHotArticle.length; j += 2) {
        arrtemp.push(arrHotArticle[j]);
      }
      arrHotArticle = arrtemp;
      res.render('technologyArticle', { tech: techArticles, hot: hotTechArticle, arrHotArticle });
    });
  });
}
router.get('/technology', getTechArticle);
function getEduArticle(req, res) {
  axios.get(`${domain}/api/v1/allArticle/Education`).then((response) => {
    const eduArticles = response.data;
    for (let i = 0; i < eduArticles.length; i++) {
      let arr = [];
      arr = eduArticles[i].images.split(',');
      eduArticles[i].images = arr[1];
    }
    axios.get(`${domain}/api/v1/hot_Article/Education`).then((responseHotEdu) => {
      const hotEduArticle = responseHotEdu.data;
      let arrHotArticle = [];
      arrHotArticle = hotEduArticle.images.split(',');
      const arrtemp = [];
      for (let j = 1; j < arrHotArticle.length; j += 2) {
        arrtemp.push(arrHotArticle[j]);
      }
      arrHotArticle = arrtemp;
      res.render('educationArticle', { edu: eduArticles, hot: hotEduArticle, arrHotArticle });
    });
  });
}
router.get('/education', getEduArticle);
function getSpArticle(req, res) {
  axios.get(`${domain}/api/v1/allArticle/Sports`).then((response) => {
    const spArticles = response.data;
    for (let i = 0; i < spArticles.length; i++) {
      let arr = [];
      arr = spArticles[i].images.split(',');
      spArticles[i].images = arr[1];
    }
    axios.get(`${domain}/api/v1/hot_Article/Sports`).then((responseHotSp) => {
      const hotSpArticle = responseHotSp.data;
      let arrHotArticle = [];
      arrHotArticle = hotSpArticle.images.split(',');
      const arrtemp = [];
      for (let j = 1; j < arrHotArticle.length; j += 2) {
        arrtemp.push(arrHotArticle[j]);
      }
      arrHotArticle = arrtemp;
      res.render('sportArticles', { sp: spArticles, hot: hotSpArticle, arrHotArticle });
    });
  });
}
router.get('/sport', getSpArticle);
function getWoArticle(req, res) {
  axios.get(`${domain}/api/v1/allArticle/World`).then((response) => {
    const woArticles = response.data;
    for (let i = 0; i < woArticles.length; i++) {
      let arr = [];
      arr = woArticles[i].images.split(',');
      woArticles[i].images = arr[1];
    }
    axios.get(`${domain}/api/v1/hot_Article/World`).then((responseHotWo) => {
      const hotWoArticle = responseHotWo.data;
      let arrHotArticle = [];
      arrHotArticle = hotWoArticle.images.split(',');
      const arrtemp = [];
      for (let j = 1; j < arrHotArticle.length; j += 2) {
        arrtemp.push(arrHotArticle[j]);
      }
      arrHotArticle = arrtemp;
      res.render('worldArticle', { wo: woArticles, hot: hotWoArticle, arrHotArticle });
    });
  });
}
router.get('/world', getWoArticle);
function getFaArticle(req, res) {
  axios.get(`${domain}/api/v1/allArticle/Family`).then((response) => {
    const faArticles = response.data;
    for (let i = 0; i < faArticles.length; i++) {
      let arr = [];
      arr = faArticles[i].images.split(',');
      faArticles[i].images = arr[1];
    }
    axios.get(`${domain}/api/v1/hot_Article/Family`).then((responseHotFa) => {
      const hotFaArticle = responseHotFa.data;
      let arrHotArticle = [];
      arrHotArticle = hotFaArticle.images.split(',');
      const arrtemp = [];
      for (let j = 1; j < arrHotArticle.length; j += 2) {
        arrtemp.push(arrHotArticle[j]);
      }
      arrHotArticle = arrtemp;
      res.render('familyArticle', { fa: faArticles, hot: hotFaArticle, arrHotArticle });
    });
  });
}
router.get('/family', getFaArticle);
module.exports = router;
