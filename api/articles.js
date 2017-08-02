var express = require('express');
var router = express.Router();
var ArticleData = require('../models/article');
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
 *      responses:
 *          200:
 *              description: list of articles
 *              schema:
 *                  $ref: '#/definitions/Article'
 */

function datagot(req,res){
    ArticleData.getAllArticleApi(function(err,data){
        res.send(data);
    })
}
router.get("/api/articles",datagot);
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
function getAllArticlebyid(req,res){
    ArticleData.getArticleByIdApi(req.params.id,function(err,data){
        res.send(data);
    })
}
router.get("/api/articles/:id",getAllArticlebyid);
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
function createArticle(req,res){
    var { headline, section, premble, body, images, author, tags, widgets, date_created, publishDate, status, CreateBy } = req.body;
       const command = ArticleData.addArticleApi({ headline, section, premble, body, images, author, tags, widgets, date_created, publishDate, status, CreateBy });
        command.then((result, err) => {
        if (err) {
        res.status(500).json(err);
        } else {
        res.status(201).json({ Message: 'Insert new product', Name });
        }
    });
}
router.post("/api/articles",createArticle);
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
function deletearticle(req,res){
     ArticleData.deleteArticleApi(req.params.id,function(err){
        res.send("deleted");
    })
}
router.delete("/api/articles/:id",deletearticle)
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
router.put("/api/articles/:id",ArticleData.updateArticleApi)
module.exports = router;