const express = require('express');
const router = express.Router();
const errorlog = require('../utils/logger').errorlog;

const ArticleData = require('../models/article');
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
 *          dateCreated:
 *              type: date
 *          publishDate:
 *              type: Date
 *          status:
 *              type: string
 *          createBy:
 *              type: string
 */
/**
 * @swagger
 * /api/v1/articles:
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
  ArticleData.getArticles((err, data) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      const notFound = new Error('No such data');
      notFound.status = 404;
      errorlog.error(`Error Status : ${notFound.status}`, `Error Message : ${notFound.message}`, `Error Trace : ${new Error().stack}`);
      return next(notFound);
    }
    res.send(data);
  });
}
router.get('/api/v1/articles', getAllArticle);
/**
 * @swagger
 * /api/v1/published-articles:
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

function getAllPublishedArticle(req, res, next) {
  ArticleData.getPublishedArticles((err, data) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      const notFound = new Error('No such data');
      notFound.status = 404;
      errorlog.error(`Error Status : ${notFound.status}`, `Error Message : ${notFound.message}`, `Error Trace : ${new Error().stack}`);
      res.send(notFound);
      //return next(notFound);???
    }
    res.send(data);
  });
}
router.get('/api/v1/published-articles', getAllPublishedArticle);
/**
 * @swagger
 * /api/v1/hot-articles:
 *  get:
 *      tags:
 *          - articles
 *      description: Return articles
 *      produces:
 *          - application/json
 *         
 *      responses:
 *          200:
 *              description: list of articles
 *              schema:
 *                  $ref: '#/definitions/Article'
 */
router.get('/api/v1/hot-articles', ArticleData.getHotArticle);
/**
 * @swagger
 * /api/v1/articles/{id}:
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
  ArticleData.getArticleById(req.params.id, (err, data) => {
    if (err) {
      return next(err);
    }
    if (!data) {
      const notFound = new Error('No such data');
      notFound.status = 404;
      errorlog.error(`Error Status : ${notFound.status}`, `Error Message : ${notFound.message}`, `Error Trace : ${new Error().stack}`);
     res.send(notFound);
    }
    res.send(data);
  });
}
router.get('/api/articles/:id', getAllArticleByid);

/**
 * @swagger
 * /api/v1/section/{section-name}/articles:
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
router.get('/api/v1/articles/:section', ArticleData.getArticleBySection);
/**
 * @swagger
 * /api/v1/articles:
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
    tags, widgets, dateCreated, publishDate, status, createBy } = req.body;
  const command = ArticleData.addArticle({
    headline,
    section,
    premble,
    body,
    images,
    author,
    tags,
    widgets,
    dateCreated,
    publishDate,
    status,
    createBy,
  });
  command.then((result, err) => {
    if (err) {
      const err = new Error('No such data');
      notFound.status = 500;
      errorlog.error(`Error Status : ${notFound.status}`, `Error Message : ${notFound.message}`, `Error Trace : ${new Error().stack}`);
      res.send(notFound);
    }
    res.status(201).json({ Message: 'Insert new Articles', Name });
  });
}
router.post('/api/v1/articles', createArticle);
/**
 * @swagger
 * /api/v1/articles/{id}:
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
  ArticleData.deleteArticle(req.params.id, (err) => {
    res.send('Deleted');
  });
}
router.delete('/api/v1/articles/:id', deletearticle);
/**
 * @swagger
 * /api/v1/articles/{id}:
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
router.put('/api/v1/articles/:id', ArticleData.updateArticle);

/**
 * @swagger
 * /api/v1/last-articles:
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
router.get('/api/v1/last-articles', ArticleData.getLastArticle);
module.exports = router;
