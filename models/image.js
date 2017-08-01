

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

//var comment = db.model('comments', { name: String });




module.exports = {
    all: function (req, res, cb) {
        var result;
        console.log("This is image model");
        console.log('get all');
        image.find(function (err, rows) {
            
           cb(rows);
           
        });
        
        
       
    },
    getDataByID: function (req, res, cb) {
        //var result;
        console.log("This is image model");
        console.log('get by id with req.body.id = ' + req.body.id);
        console.log('get by id with req.params.id = ' + req.params.id);
        //image.find({_id: "597b0ced4cafbb18cc90e7dc"}, function (err, rows) {
        image.find({_id: req.body.id}, function (err, rows) {
            
           cb(rows);
           
        });
        
        
       
    },
    //getDataByMoment
    getDataByMoment: function (req, res, cb) {
        image.find({moment: req.body.moment}, function (err, rows) {
            
           cb(rows);
           
        });
    },

    getAll: function (req, res, cb) {
        //var result;
        //console.log("This is image model");
        console.log('get all and view');
        image.find(function (err, rows) {
            if (err) {
                res.send(err);
            }
            //console.log(rows);
            //res.json(rows);
            //result = rows;
           // console.log('result0 ' + result);

            console.log(rows);

            cb(rows);
            
            res.render('image2', { data: rows, layout: false});
            //res.render('image0');
    
            //res.render('products', { title: "RESTful Crud Example", data: rows });
        });
        //console.log('result1 ' + result);
        
       
    },

    

    insert: function (req, res, objinfo, obj, cb) {
        console.log("in add");
        var p = new image();
        //p.heading = req.body.heading;
        //p.media = req.body.media;
        //p.description = req.body.description;        
        //p.photographer = req.body.photographer;
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
            p.medialist.teaser = objinfo.teaser;
            p.medialist.searchResult = objinfo.searchResult;
            p.medialist.articlePreview = objinfo.articlePreview;
        }
        

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
            p.heading = req.body.heading;
            
            p.description = req.body.description;
            //p.caption = req.body.caption;
            p.photographer = req.body.photographer;
            //p.heading = 'heading';
            //p.media = objinfo.path;
            //p.description = 'description';           
            //p.photographer = 'photorapher';
            p.usercreate = 'unknow';

        //p.medialist.teaser = objinfo.teaser;
        //p.medialist.searchResult = objinfo.searchResult;
        //p.medialist.articlePreview = objinfo.articlePreview;

            p.save(function (err, img) {
                if (err) {
                    res.send(err);
                }
                    

                //res.json({ message: 'image updated!' });
                res.send(img);
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
