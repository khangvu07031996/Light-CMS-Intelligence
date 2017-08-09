

//var db = require('../db');
var db = require('mongoose');
//var bodyParser = require('body-parser');
var _ = require('lodash');
//var multer = require('multer');


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
        articlePreview: ""
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
    }

};


