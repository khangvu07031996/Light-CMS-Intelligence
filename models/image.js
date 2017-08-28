

// var db = require('../db');
const db = require('mongoose');
// var bodyParser = require('body-parser');
const _ = require('lodash');
// var multer = require('multer');
const openCvHelper = require('../helper/openCvHelper');
const path = require('path');
const imageHelper = require('../helper/imageHelper');

const Schema = db.Schema;
const imageSchema = new Schema({
  heading: String,
  description: String,
  media: String,
  // caption: String,
  photographer: String,
  medialist: {
    teaser: '',
    searchResult: '',
    articlePreview: '',
    thumbnail: {
      thumbnail_567x330: '',
      thumbnail_550x330: '',
      thumbnail_390x240: '',
      thumbnail_112x112: '',

    },

  },

  imageinfo: {
    size: String,
    ratio: String,
  },
  usercreate: String,
  datecreate: {
    type: Date,
    default: Date.now,
  },
  moment: String,
});


imageSchema.virtual('imageinfo.full').get(function () {
  return _.startCase(`${this.imageinfo.size} ${this.imageinfo.ratio}`);
});

imageSchema.virtual('imageinfo.full').set(function (value) {
  const bits = value.split(' ');
  this.imageinfo.size = bits[0];
  this.imageinfo.ratio = bits[1];
});

const image = db.model('image', imageSchema);

module.exports = {
  getAll(req, res, cb) {
    image.find((err, rows) => {
      cb(err, rows);
    });
  },
  getDataByID(req, res, cb) {
    image.find({ _id: req.body.id }, (err, rows) => {
      cb(err, rows);
    });
  },
  // getDataByMoment
  getDataByMoment(req, res, cb) {
    image.find({ moment: req.body.moment }, (err, rows) => {
      cb(err, rows);
    });
  },


  insert(req, res, objinfo, obj, cb) {
    const p = new image();

    if (objinfo == null) {
      p.media = obj.path;
      p.heading = '';
      p.description = '';
      p.photographer = '';
      p.usercreate = 'unknow';

      p.moment = obj.moment;

      p.medialist.teaser = '';
      p.medialist.searchResult = '';
      p.medialist.articlePreview = obj.articlePreview;

      p.medialist.thumbnail = obj.thumbnail;
    } else {
      p.heading = req.body.heading;
      p.media = objinfo.path;
      p.description = req.body.description;
      p.photographer = req.body.photographer;
      p.medialist.teaser = '';
      p.medialist.searchResult = '';
      p.medialist.articlePreview = objinfo.articlePreview;

      p.usercreate = 'unknow';
      p.moment = objinfo.moment;
      p.medialist.thumbnail = objinfo.thumbnail;
    }


    p.save((err) => {
      if (err) {
        res.send(err);
      }

      cb(err, p);
    });
  },

  edit(req, res, cb) {
    image.findById(req.params.image_id, (err, row) => {
      cb(err, row);
    });
  },

  update(req, res) {
    image.findById(req.params.image_id, (err, p) => {
      if (err) {
        res.send(err);
      }
      p.heading = req.body.heading;
      p.description = req.body.description;
      p.photographer = req.body.photographer;
      p.usercreate = 'unknow';

      p.save((err, img) => {
        if (err) {
          res.send(err);
        }
      });
    });
  },

  // Ajax update:
  ajaxUpdate(req, res) {
    image.findById(req.params.image_id, (err, p) => {
      if (err) {
        res.send(err);
      }
      p.heading = req.body.heading;
      p.description = req.body.description;
      p.photographer = req.body.photographer;
      p.usercreate = 'unknow';

      p.save((err, img) => {
        if (err) {
          res.send(err);
        }

        res.send(img);
      });
    });
  },

  delete(req, res, cb) {
    console.log(`_id = ${req.params.image_id}`);
    image.remove({ _id: req.params.image_id }, (err, prod) => {
      cb(err, prod);
    });
  },

  cropImage(req, res, cb) {
    image.findById(req.body.id, (err, p) => {
      let src = `${p.media}/${p.medialist.articlePreview}`;
      let dstDir = p.media;
      const filename = p.medialist.articlePreview.replace('.jpg', '');
      const dirRoot = path.dirname(require.main.filename).replace('\\', '\/');
      src = `${dirRoot}/publics${src}`;
      dstDir = `${dirRoot}/publics${dstDir}`;

      const countFaces = openCvHelper.cropFaces(src, filename, dstDir, (count) => {
        // create object include info of image croped:
        const data = {};
        data.path = p.media;
        data.count = count;
        data.filename = filename;

        cb(err, data);
      }, (src) => {
        imageHelper.resize(src, src, 200, 200);
      });
    });
  },

};

