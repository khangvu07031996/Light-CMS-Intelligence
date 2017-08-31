const express = require('express');

const router = express.Router();
const ArticleData = require('../models/article');
const errorlog = require('../utils/logger').errorlog;
/**
 * @swagger
 * definition:
 *  Article:
 *      properties:
 *          headline:
 *              type: string
 *          section:
 *              type: string
 *          premble:
 *              type: string
 *          body:
 *              type: string
 *          images:
 *              type: string
 *          author:
 *              type: string
 *          tags:
 *              type: string
 *          widgets:
 *              type: string
 *          date_created:
 *              type: date
 *          publishDate:
 *              type: Date
 *          status:
 *              type: string
 *          CreateBy:
 *              type: string
 */
/**
 * @swagger
 * /api/articles:
 *  get:
 *      tags:
 *          - articles
 *      description: Return all articles
 *      produces:
 *          - application/json
 *         
 *      responses:
 *          200:
 *              description: list of articles
 *              schema:
 *                  $ref: '#/definitions/Article'
 */

function getAllArticle(req, res, next) {
  ArticleData.getAllArticleApi((err, data) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      const notFound = new Error('No such data');
      notFound.status = 404;
      errorlog.error(`Error Status : ${notFound.status}`, `Error Message : ${notFound.message}`);
      errorlog.error('Error Trace : %s', `${new Error().stack}`);
      return next(notFound);
    }
    res.send(data);
  });
}
router.get('/api/articles', getAllArticle);
/**
 * @swagger
 * /api/hotArticles:
 *  get:
 *      tags:
 *          - articles
 *      description: Return some articles
 *      produces:
 *          - application/json
 *         
 *      responses:
 *          200:
 *              description: list of articles
 *              schema:
 *                  $ref: '#/definitions/Article'
 */
router.get('/api/hotArticles', ArticleData.getHotArticle);
/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     tags:
 *       - articles
 *     description: Returns a single article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: articles's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single article
 *         schema:
 *           $ref: '#/definitions/Article'
 */
function getAllArticleByid(req, res, next) {
  ArticleData.getArticleByIdApi(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      const notFound = new Error('No such data');
      notFound.status = 404;
      errorlog.error(`Error Status : ${notFound.status}`, `Error Message : ${notFound.message}`);
      errorlog.error('Error Trace : %s', `${new Error().stack}`);
      return next(notFound);
    }
    res.send(data);
  });
}
router.get('/api/articles/:id', getAllArticleByid);

/**
 * @swagger
 * /api/articles/{section}:
 *   get:
 *     tags:
 *       - articles
 *     description: Returns some article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: section
 *         description: articles's section
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: A single article
 *         schema:
 *           $ref: '#/definitions/Article'
 */
router.get('/api/articles/:section', ArticleData.getArticleBySection);
/**
 * @swagger
 * /api/articles:
 *   post:
 *     tags:
 *       - articles
 *     description: Creates a new article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: Article
 *         description: Article object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Article'
 *     responses:
 *       200:
 *         description: Successfully created
 */
function createArticle(req, res, next) {
  const { headline, section,
    premble, body, images, author,
    tags, widgets, date_created, publishDate, status, CreateBy } = req.body;
  const command = ArticleData.addArticleApi({
    headline,
    section,
    premble,
    body,
    images,
    author,
    tags,
    widgets,
    date_created,
    publishDate,
    status,
    CreateBy,
  });
  command.then((result, err) => {
    if (err) {
      const err = new Error('No such data');
      notFound.status = 500;
      errorlog.error(`Error Status : ${notFound.status}`, `Error Message : ${notFound.message}`);
      errorlog.error('Error Trace : %s', `${new Error().stack}`);
      return next(notFound);
    }
    res.status(201).json({ Message: 'Insert new Articles', Name });
  });
}
router.post('/api/articles', createArticle);
/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     tags:
 *       - articles
 *     description: Deletes a single article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: article's id
 *         in: path
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: Successfully deleted
 */
function deletearticle(req, res) {
  ArticleData.deleteArticleApi(req.params.id, (err) => {
    res.send('deleted');
  });
}
router.delete('/api/articles/:id', deletearticle);
/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     tags:
 *       - articles
 *     description: Updates a single article
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Article's id
 *         in: path
 *         required: true
 *         type: string
 *       - name: Article
 *         description: Article object
 *         in: body
 *         required: true
 *         schema:
 *           $ref: '#/definitions/Article'
 *     responses:
 *       200:
 *         description: Successfully updated
 */
router.put('/api/articles/:id', ArticleData.updateArticleApi);

/**
 * @swagger
 * /api/lastArticles:
 *  get:
 *      tags:
 *          - articles
 *      description: Return last articles
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: list of articles
 *              schema:
 *                  $ref: '#/definitions/Article'
 */
router.get('/api/lastArticles', ArticleData.getlastArticle);
module.exports = router;
