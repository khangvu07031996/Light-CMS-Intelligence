let mongoose = require('mongoose');
let mongoosePaginate = require('mongoose-paginate');
let _ = require("lodash");
let openCvHelper = require("../helpers/openCvHelper");
let path = require("path");
let imageHelper = require("../helpers/imageHelper");

let Schema = mongoose.Schema;
let imageSchema = new Schema({
  heading: String,
  description: String,
  media: String,
  photographer: String,
  medialist: {
    teaser: "",
    searchResult: "",
    articlePreview: "",
    imageupload: "",
    thumbnail: {
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
  dateupdate: {
    type: Date,
    default: Date.now,
  },
  moment: String,
});

imageSchema.virtual("imageinfo.full").get(function () {
  return _.startCase(`${this.imageinfo.size} ${this.imageinfo.ratio}`);
});

imageSchema.virtual("imageinfo.full").set(function (value) {
  let bits = value.split(" ");
  this.imageinfo.size = bits[0];
  this.imageinfo.ratio = bits[1];
});

imageSchema.plugin(mongoosePaginate);
let image = mongoose.model("image", imageSchema);

module.exports = {
  getAll(page, limit, callback) {
    if (page === -1 || limit === -1) {
      image.find((err, rows) => {
        callback(err, rows);
        return false;
      });
    } else {
      image.paginate({}, { page, limit }, (err, result) => {
        console.log(result);
        callback(err, result);
      });
    }
  },
  getDataByID(id, callback) {
    image.find({ _id: id }, (err, rows) => {
      callback(err, rows);
      return false;
    });
  },
  // getDataByMoment
  getDataByMoment(m, callback) {
    image.find({ moment: m }, (err, rows) => {
      callback(err, rows);
    });
  },

  insert(img, callback) {
    let p = new image();
    p.media = img.media;
    p.heading = img.heading;
    p.description = img.description;
    p.photographer = img.photographer;
    p.usercreate = img.usercreate;
    p.moment = img.moment;
    p.medialist.teaser = img.medialist.teaser;
    p.medialist.searchResult = img.medialist.searchResult;
    p.medialist.articlePreview = img.medialist.articlePreview;
    p.medialist.thumbnail = img.medialist.thumbnail;
    p.save((err) => {
      callback(err, p);
    });
  },

  edit(id, callback) {
    image.findById(id, (err, row) => {
      callback(err, row);
    });
  },

  update(img, callback) {
    image.findById(img.id, (err, p) => {
      if (err) {
        callback(err, null);
        return false;
      }
      p.heading = img.heading;
      p.description = img.description;
      p.photographer = img.photographer;
      p.usercreate = img.usercreate;
      p.save((error, imgdata) => {
        callback(error, imgdata);
        return false;
      });
      return false;
    });
  },

  // Ajax update:
  ajaxUpdate(img, callback) {
    image.findById(img.id, (err, p) => {
      if (err) {
        callback(err, null);
        return false;
      }
      p.heading = img.heading;
      p.description = img.description;
      p.photographer = img.photographer;
      p.save((error, img) => {
        callback(error, img);
        return false;
      });
      return false;
    });
  },

  delete(id, callback) {
    image.remove({ _id: id }, (err, prod) => {
      callback(err, prod);
    });
  },

  cropImage(req, res, callback) {
    image.findById(req.body.id, (err, p) => {
      let src = `${p.media}/${p.medialist.articlePreview}`;
      let dstDir = p.media;
      let filename = p.medialist.articlePreview.replace(".jpg", "");
      let dirRoot = path.dirname(require.main.filename).replace("\\", "/");
      src = `${dirRoot}/publics${src}`;
      dstDir = `${dirRoot}/publics${dstDir}`;
      let countFaces = openCvHelper.cropFaces(src, filename, dstDir, (count) => {
        // create object include info of image croped:
        let data = {};
        data.path = p.media;
        data.count = count;
        data.filename = filename;
        callback(err, data);
      }, (imgSrc) => {
        imageHelper.resize(imgSrc, imgSrc, 200, 200);
      });
    });
  },

};

