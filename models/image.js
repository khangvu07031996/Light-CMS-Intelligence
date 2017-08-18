

const db = require('mongoose');

const _ = require('lodash');

const Schema = db.Schema;
const imageSchema = new Schema({
  heading: String,
  description: String,
  media: String,

  photographer: String,
  medialist: {
    teaser: '',
    searchResult: '',
    articlePreview: '',
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
  all(req, res, cb) {
    let result;
    image.find((err, rows) => {
      cb(rows);
    });
  },
  getDataByID(req, res, cb) {
    console.log('This is image model');
    console.log(`get by id with req.body.id = ${req.body.id}`);
    console.log(`get by id with req.params.id = ${req.params.id}`);

    image.find({ _id: req.body.id }, (err, rows) => {
      cb(rows);
    });
  },
  // getDataByMoment
  getDataByMoment(req, res, cb) {
    image.find({ moment: req.body.moment }, (err, rows) => {
      cb(rows);
    });
  },
  getAll(req, res, cb) {
    image.find((err, rows) => {
      if (err) {
        res.send(err);
      }

      cb(rows);
    });
  },


  insert(req, res, objinfo, obj, cb) {
    console.log('in add');
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
    }


    p.save((err) => {
      if (err) {
        res.send(err);
      }
      console.log('inserted');

      cb(err, p);
    });
  },

  edit(req, res, cb) {
    image.findById(req.params.image_id, (err, row) => {
      cb(err, row);
    });
  },
  update(req, res) {
    image.findById(req.params.id, (err, p) => {
      if (err) {
        res.send(err);
      } else {
        p.heading = req.body.heading;
        p.description = req.body.description;
        p.photographer = req.body.photographer;
        p.usercreate = 'unknow';
        p.save((err) => {
          if (err) {
            res.send(err);
          }

          res.redirect('/image');
        });
      }
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

      console.log(`description: ${req.body.description}`);

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

};
