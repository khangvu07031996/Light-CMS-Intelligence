

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
        Teaser: "",
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

        var kitty = new image({ heading: 'Photo one' });
        kitty.save(function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log('meow');
            }
        });
    },

    


    upload: function (req, res) {

        
        console.log('file::::::::::: ' + req.file);
        console.log(req.file.path);
        //res.send("Upload successful");
    },

    insert: function (req, res, cb) {
        console.log("in add");
        var p = new image();
        //p.heading = req.body.heading;
        //p.media = req.body.media;
        //p.description = req.body.description;
        //p.caption = req.body.caption;
        //p.photographer = req.body.photographer;
        p.heading = 'heading';
        p.media = req.file.path;
        p.description = 'description';
        p.caption = 'caption';
        p.photographer = 'photorapher';
        p.usercreate = 'unknow';
        
        p.save(function (err) {
            if (err) {
                res.send(err);
            }
            console.log("inserted");
            //res.send({ message: 'Product Created ----!' })
            //res.send({ title: '--' + p.title });
            cb(err, p);
        });
    } 
};
