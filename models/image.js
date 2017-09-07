let db = require("mongoose");
let _ = require("lodash");
let openCvHelper = require("../helpers/openCvHelper");
let path = require("path");
let imageHelper = require("../helpers/imageHelper");

let Schema = db.Schema;
let imageSchema = new Schema({
  heading: String,
  description: String,
  media: String,
  // caption: String,
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

let image = db.model("image", imageSchema);

module.exports = {
  getAll(req, res, cb) {
    image.find((err, rows) => {
      cb(err, rows);
      return false;
    });
  },
  getDataByID(req, res, cb) {
    image.find({ _id: req.body.id }, (err, rows) => {
      cb(err, rows);
      return false;
    });
  },
  // getDataByMoment
  getDataByMoment(req, res, cb) {
    image.find({ moment: req.body.moment }, (err, rows) => {
      cb(err, rows);
    });
  },


  insert(req, res, objinfo, obj, cb) {
    let p = new image();

    if (objinfo == null) {
      p.media = obj.path;
      p.heading = "";
      p.description = "";
      p.photographer = "";
      p.usercreate = "";

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
      p.usercreate = req.body.usercreate;
      p.moment = objinfo.moment;
      p.medialist.thumbnail = objinfo.thumbnail;
    }

    p.save((err) => {
      cb(err, p);
    });
  },

  edit(req, res, cb) {
    image.findById(req.params.image_id, (err, row) => {
      cb(err, row);
    });
  },

  update(req, res, cb) {
    image.findById(req.params.image_id, (err, p) => {
      if (err) {
        cb(err, null);
        return false;
      }
      p.heading = req.body.heading;
      p.description = req.body.description;
      p.photographer = req.body.photographer;
      p.usercreate = req.body.usercreate;
      p.save((error, img) => {
        cb(error, img);
        return false;
      });
      return false;
    });
  },

  // Ajax update:
  ajaxUpdate(req, res, cb) {
    image.findById(req.params.image_id, (err, p) => {
      if (err) {
        cb(err, null);
        return false;
      }
      p.heading = req.body.heading;
      p.description = req.body.description;
      p.photographer = req.body.photographer;
      // p.usercreate = "unknow";
      p.save((error, img) => {
        cb(error, img);
        return false;
      });
      return false;
    });
  },

  delete(req, res, cb) {
    image.remove({ _id: req.params.image_id }, (err, prod) => {
      cb(err, prod);
    });
  },

  cropImage(req, res, cb) {
    image.findById(req.body.id, (err, p) => {
      let src = `${p.media}/${p.medialist.articlePreview}`;
      let dstDir = p.media;
      let filename = p.medialist.articlePreview.replace(".jpg", "");
      let dirRoot = path.dirname(require.main.filename).replace("\\", "/");
      src = `${dirRoot}/publics${src}`;
      dstDir = `${dirRoot}/publics${dstDir}`;
      let countFaces = openCvHelper.cropFaces(src, filename, dstDir, (count) => {
        let data = {};
        data.path = p.media;
        data.count = count;
        data.filename = filename;
        cb(err, data);
      }, (imgSrc) => {
        imageHelper.resize(imgSrc, imgSrc, 200, 200);
      });
    });
  },

};

