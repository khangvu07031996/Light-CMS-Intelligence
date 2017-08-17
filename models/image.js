

//var db = require('../db');
var db = require('mongoose');
//var bodyParser = require('body-parser');
var _ = require('lodash');
//var multer = require('multer');
var openCvHelper = require('../helper/openCvHelper');
const path = require('path');
var imageHelper = require('../helper/imageHelper');

var Schema = db.Schema;
var imageSchema = new Schema({
    heading: String,
    description: String,
    media: String,
    // caption: String,
    photographer: String,
    medialist: {
        teaser: "",
        searchResult: "",
        articlePreview: "",
        thumbnail: {
            thumbnail_567x330: "",
            thumbnail_550x330: "",
            thumbnail_390x240: "",
            thumbnail_112x112: ""

        },

    },    

    imageinfo: {
        size: String,
        ratio: String
    },
    usercreate: String,
    datecreate: {
        type: Date,
        "default": Date.now
    },
    datecreate: {
        type: Date,
        "default": Date.now
    },
    moment: String
});


imageSchema.virtual('imageinfo.full').get(function () {
    return _.startCase(this.imageinfo.size + ' ' + this.imageinfo.ratio);
});

imageSchema.virtual('imageinfo.full').set(function (value) {
    var bits = value.split(' ');
    this.imageinfo.size = bits[0];
    this.imageinfo.ratio = bits[1];
});

var image = db.model('image', imageSchema);

module.exports = {
    getAll: function (req, res, cb) {

        console.log("This is image model");
        console.log('get all');
        image.find(function (err, rows) {
            cb(err, rows);
        });

    },
    getDataByID: function (req, res, cb) {
        console.log('get by id with req.body.id = ' + req.body.id);

        image.find({ _id: req.body.id }, function (err, rows) {

            cb(err, rows);

        });
    },
    //getDataByMoment
    getDataByMoment: function (req, res, cb) {
        image.find({ moment: req.body.moment }, function (err, rows) {

            cb(err, rows);

        });
    },



    insert: function (req, res, objinfo, obj, cb) {
        console.log("in add");
        var p = new image();

        if (objinfo == null) {
            p.media = obj.path;
            p.heading = '';
            p.description = '';
            p.photographer = '';
            p.usercreate = 'unknow';

            p.moment = obj.moment;

            p.medialist.teaser = "";
            p.medialist.searchResult = "";
            p.medialist.articlePreview = obj.articlePreview;

            p.medialist.thumbnail = obj.thumbnail;
        } else {
            p.heading = req.body.heading;
            p.media = objinfo.path;
            p.description = req.body.description;
            p.photographer = req.body.photographer;
            p.medialist.teaser = "";
            p.medialist.searchResult = "";
            p.medialist.articlePreview = objinfo.articlePreview;

            p.usercreate = 'unknow';
            p.moment = objinfo.moment;
			p.medialist.thumbnail = objinfo.thumbnail;
        }


        p.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log("inserted");
            cb(err, p);
        });
    },

    edit: function (req, res, cb) {
        image.findById(req.params.image_id, function (err, row) {
            cb(err, row);
        });
    },

    update: function (req, res) {
        image.findById(req.params.image_id, function (err, p) {
            if (err) {
                res.send(err);
            }
            p.heading = req.body.heading;
            p.description = req.body.description;
            p.photographer = req.body.photographer;
            p.usercreate = 'unknow';

            p.save(function (err, img) {
                if (err) {
                    res.send(err);
                }
            });

        });
    },

    //Ajax update:
    ajaxUpdate: function (req, res) {

        image.findById(req.params.image_id, function (err, p) {
            if (err) {
                res.send(err);
            }
            p.heading = req.body.heading;
            p.description = req.body.description;
            p.photographer = req.body.photographer;
            p.usercreate = 'unknow';

            p.save(function (err, img) {
                if (err) {
                    res.send(err);
                }

                res.send(img);
            });

        });
    },

    delete: function (req, res, cb) {
        console.log('_id = ' + req.params.image_id)
        image.remove({ _id: req.params.image_id }, function (err, prod) {

            cb(err, prod);
        })
    },

    cropImage: function(req, res, cb) {
        console.log('model : id = ' + req.body.id)
        image.findById(req.body.id, function (err, p) {
            
            let src = p.media + "/" + p.medialist.articlePreview;
            let dstDir = p.media;
            let filename = p.medialist.articlePreview.replace(".jpg", "");
            let dirRoot = path.dirname(require.main.filename).replace("\\", "\/");
            src = dirRoot + "/publics" + src;
            dstDir = dirRoot + "/publics" + dstDir;
			
			console.log(src);
			console.log(dstDir);
			console.log(filename);
			
            let countFaces = openCvHelper.cropFaces(src, filename, dstDir, function(count) {
                console.log('count faces = ' +  count);
                //create object include info of image croped:
                let data = {};
                data.path = p.media;
                data.count = count;
                data.filename = filename;
    
                cb(err, data);
            }, function(src) {
				imageHelper.resize(src, src, 200, 200);
			});
			

        });
    }

};


