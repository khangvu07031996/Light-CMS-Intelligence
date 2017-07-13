

var db = require('../db');
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

//var comment = db.model('comments', { name: String });




module.exports = {
    all: function () {
        console.log("This is image model");

       
    },

    


    upload: function (req, res) {

        
        console.log(req.file);
        console.log('path = ' + req.file.path);
        //res.send("Upload successful");
    },

    insert: function (req, res, objinfo, cb) {
        console.log("in add");
        var p = new image();
        //p.heading = req.body.heading;
        //p.media = req.body.media;
        //p.description = req.body.description;
        //p.caption = req.body.caption;
        //p.photographer = req.body.photographer;
        p.heading = 'heading';
        p.media = objinfo.path;
        p.description = 'description';
        p.caption = 'caption';
        p.photographer = 'photorapher';
        p.usercreate = 'unknow';

        p.medialist.teaser = objinfo.teaser;
        p.medialist.searchResult = objinfo.searchResult;
        p.medialist.articlePreview = objinfo.articlePreview;

        p.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log("inserted");
            //res.send({ message: 'image Created ----!' })
            //res.send({ title: '--' + p.title });
            cb(err, p);
        });
    },

    edit: function (req, res) {


        image.findById(req.params.image_id, function (err, rows) {
            if (err)
                res.send(err);
            //res.json(rows);
            res.render('edit', { title: "Edit image", data: rows });
        });
    },

    update: function (req, res) {

        image.findById(req.params.image_id, function (err, p) {
            if (err) {
                res.send(err);
            }
            //p.heading = req.body.heading;
            //p.media = req.body.media;
            //p.description = req.body.description;
            //p.caption = req.body.caption;
            //p.photographer = req.body.photographer;
            p.heading = 'heading';
            //p.media = objinfo.path;
            p.description = 'description';
            p.caption = 'caption';
            p.photographer = 'photorapher';
            p.usercreate = 'unknow';

        //p.medialist.teaser = objinfo.teaser;
        //p.medialist.searchResult = objinfo.searchResult;
        //p.medialist.articlePreview = objinfo.articlePreview;

            p.save(function (err) {
                if (err)
                    res.send(err);

                res.json({ message: 'image updated!' });
            });

        });
    },

    delete: function (req, res) {
        console.log('_id = ' + req.params.image_id)
        image.remove({ _id: req.params.image_id }, function (err, prod) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted' });
        })
    }

};
