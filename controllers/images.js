const express = require("express");
const fs = require("fs");
const path = require("path");
const image = require("../models/image");
const imageHelper = require("../helpers/imageHelper");
const directoryHelper = require("../helpers/directoryHelper");


const router = express.Router();
// Create object for directory:
let dirObject = {};
dirObject.strDateTime = "";
dirObject.dtObj = null;
dirObject.destDirectory = "";
dirObject.virtualDir = "";
dirObject.moment = "";
dirObject.appDir = "";
// Variable medialist:
let original;
const setting = {
  objThumbnailDim: {
    0: { width: 567, height: 330 },
    1: { width: 550, height: 330 },
    2: { width: 400, height: 400 },
    3: { width: 390, height: 240 },
    4: { width: 300, height: 300 },
    5: { width: 112, height: 112 },
    6: { width: 75, height: 75 },
    count: 7,
  },

};
let objThumbnailName = [];

// function create directory:
router.get("/image/create-directory", (req, res) => {
  directoryHelper.initCreateDirectory(dirObject,
    directoryHelper.getDateTimeObject,
    directoryHelper.createDirectory);
  res.send("Created Directory");
});

// Get only all data:
router.get("/image/data", (req, res) => {
  image.getAll((err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

router.post("/image/data-by-moment", (req, res) => {
  image.getDataByMoment(req.body.moment, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

router.post("/image/data-by-id", (req, res) => {
  image.getDataByID(req.body.id, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.send(result);
  });
});

// Get all data and render view:
router.get("/image", (req, res) => {
  console.log(`query = ${req.query.page}`);
  let limit = 2;
  let page = 1;
  let totalRows = 1;
  let index = Number(req.query.page);
  if (!isNaN(index)) {
    page = index;
  }
  console.log(`page = ${page}`);
  image.getAll(page, limit, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.render("imageForm", { images: result.docs,
      pagination: { page, limit, totalRows: result.total } });
  });
});

let multer = require("multer");

let arrPath = [];
let count = 0;
let storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, dirObject.destDirectory);
  },
  filename(req, file, callback) {
    let strDate = dirObject.moment;
    strDate = `${strDate}_${count}.jpg`;
    count++;
    original = `Original_${strDate}`;
    arrPath.push(original);
    callback(null, original);
  },

});

let upload = multer({ storage });

// Upload with ajax and insert:
router.post("/image/ajax-upload", upload.any(), (req, res) => {
  for (let i = 0; i < arrPath.length; i++) {
    let indexOf_ = arrPath[i].indexOf("_");
    let subString = arrPath[i].substring(indexOf_ + 1);
    // Create name of thumbnail images:
    objThumbnailName = [];
    for (let j = 0; j < setting.objThumbnailDim.count; j++) {
      objThumbnailName.push(`${setting.objThumbnailDim[j].width}x${setting.objThumbnailDim[j].height}_${subString}`);
    }
    // create object thumbnail:
    let thumbnail = {
      thumbnail_567x330: objThumbnailName[0],
      thumbnail_550x330: objThumbnailName[1],
      thumbnail_400x400: objThumbnailName[2],
      thumbnail_390x240: objThumbnailName[3],
      thumbnail_300x300: objThumbnailName[4],
      thumbnail_112x112: objThumbnailName[5],
      thumbnail_75x75: objThumbnailName[6]
    };
    // Resize image with widthxheight:
    for (let j = 0; j < objThumbnailName.length; j++) {
      let src = `${dirObject.destDirectory}/${arrPath[i]}`;
      let dst = `${dirObject.destDirectory}/${objThumbnailName[j]}`;

      imageHelper.resize(src, dst, setting.objThumbnailDim[j].width,
        setting.objThumbnailDim[j].height);
    }
    // Resize with height:        
    objThumbnailName = [];
    for (let j = 0; j < setting.objThumbnailDim.count; j++) {
      objThumbnailName.push(`x${setting.objThumbnailDim[j].height}_${subString}`);
    }
    // create object thumbnail:
    thumbnail.thumbnail_x330 = objThumbnailName[0];
    thumbnail.thumbnail_x400 = objThumbnailName[2];
    thumbnail.thumbnail_x240 = objThumbnailName[3];
    thumbnail.thumbnail_x300 = objThumbnailName[4];
    thumbnail.thumbnail_x112 = objThumbnailName[5];
    thumbnail.thumbnail_x75 = objThumbnailName[6];
    // Resize image with height:
    imageHelper.resizeByHeight(objThumbnailName, dirObject,
      arrPath, setting, i);
    // Resize with width:        
    objThumbnailName = [];
    for (let j = 0; j < setting.objThumbnailDim.count; j++) {
      objThumbnailName.push(`${setting.objThumbnailDim[j].width}x_${subString}`);
    }
    // create object thumbnail:
    thumbnail.thumbnail_567x = objThumbnailName[0];
    thumbnail.thumbnail_550x = objThumbnailName[1];
    thumbnail.thumbnail_400x = objThumbnailName[2];
    thumbnail.thumbnail_390x = objThumbnailName[3];
    thumbnail.thumbnail_300x = objThumbnailName[4];
    thumbnail.thumbnail_112x = objThumbnailName[5];
    thumbnail.thumbnail_75x = objThumbnailName[6];
    // Resize image with width:
    imageHelper.resizeByWidth(objThumbnailName, dirObject,
      arrPath, setting, i);
    let obj = {
      articlePreview: arrPath[i],
      path: dirObject.virtualDir,
      moment: dirObject.moment,
      thumbnail,
    };
    // create object to insert:
    let img = {};
    img.media = obj.path;
    img.moment = obj.moment;
    img.medialist = {};
    img.medialist.articlePreview = obj.articlePreview;
    img.medialist.thumbnail = obj.thumbnail;
    image.insert(img, (err, img) => {
      if (err) res.send(err);
    });
  }

  // reset:
  arrPath = [];
  count = 0;
  res.send(dirObject.moment);
});
// Upload image:
router.post("/image/upload", upload.any(), (req, res) => {
  res.json("Inserted successfully");
});
// Insert image infomation:
router.post("/image/insert", (req, res) => {
  for (let i = 0; i < arrPath.length; i++) {
    let indexOf_ = arrPath[i].indexOf("_");
    let subString = arrPath[i].substring(indexOf_ + 1);
    // Create name of thumbnail images:
    objThumbnailName = [];
    for (let j = 0; j < setting.objThumbnailDim.count; j++) {
      objThumbnailName.push(`${setting.objThumbnailDim[j].width}x${setting.objThumbnailDim[j].height}_${subString}`);
    }
    // create object thumbnail:
    let thumbnail = {
      thumbnail_567x330: objThumbnailName[0],
      thumbnail_550x330: objThumbnailName[1],
      thumbnail_400x400: objThumbnailName[2],
      thumbnail_390x240: objThumbnailName[3],
      thumbnail_300x300: objThumbnailName[4],
      thumbnail_112x112: objThumbnailName[5],
      thumbnail_75x75: objThumbnailName[6]
    };
    // Resize image:
    for (let j = 0; j < objThumbnailName.length; j++) {
      let src = `${dirObject.destDirectory}/${arrPath[i]}`;
      let dst = `${dirObject.destDirectory}/${objThumbnailName[j]}`;

      imageHelper.resize(src, dst, setting.objThumbnailDim[j].width,
        setting.objThumbnailDim[j].height);
    }
    // Resize with height:        
    objThumbnailName = [];
    for (let j = 0; j < setting.objThumbnailDim.count; j++) {
      objThumbnailName.push(`x${setting.objThumbnailDim[j].height}_${subString}`);
    }
    // create object thumbnail:
    thumbnail.thumbnail_x330 = objThumbnailName[0];
    thumbnail.thumbnail_x400 = objThumbnailName[2];
    thumbnail.thumbnail_x240 = objThumbnailName[3];
    thumbnail.thumbnail_x300 = objThumbnailName[4];
    thumbnail.thumbnail_x112 = objThumbnailName[5];
    thumbnail.thumbnail_x75 = objThumbnailName[6];
    // Resize image with height:
    imageHelper.resizeByHeight(objThumbnailName, dirObject,
      arrPath, setting, i);
    // Resize with width:        
    objThumbnailName = [];
    for (let j = 0; j < setting.objThumbnailDim.count; j++) {
      objThumbnailName.push(`${setting.objThumbnailDim[j].width}x_${subString}`);
    }
    // create object thumbnail:
    thumbnail.thumbnail_567x = objThumbnailName[0];
    thumbnail.thumbnail_550x = objThumbnailName[1];
    thumbnail.thumbnail_400x = objThumbnailName[2];
    thumbnail.thumbnail_390x = objThumbnailName[3];
    thumbnail.thumbnail_300x = objThumbnailName[4];
    thumbnail.thumbnail_112x = objThumbnailName[5];
    thumbnail.thumbnail_75x = objThumbnailName[6];
    // Resize image with width:
    imageHelper.resizeByWidth(objThumbnailName, dirObject,
      arrPath, setting, i);

    let imgInfo = {
      articlePreview: arrPath[i],
      path: dirObject.virtualDir,
      moment: dirObject.moment,
      thumbnail,
    };
    // Create object to insert:
    let img = {};
    img.heading = req.body.heading;
    img.media = imgInfo.path;
    img.description = req.body.description;
    img.photographer = req.body.photographer;
    img.medialist = {};
    img.medialist.articlePreview = imgInfo.articlePreview;
    img.usercreate = req.body.usercreate;
    img.moment = imgInfo.moment;
    img.medialist.thumbnail = imgInfo.thumbnail;
    image.insert(img, (err, img) => {
      if (err) {
        res.send(err);
      }
    });
  }
  // reset:
  arrPath = [];
  count = 0;
  res.json("Inserted successfully");
});


router.get("/image/add", (req, res) => {
  res.render("addImage");
});
// render form edit:
router.route("/image/:id").get((req, res) => {
  image.edit(req.params.id, (err, row) => {
    if (err) res.send(err);
    res.render("editImage", { image: row });
  });
});
// update image and render form list images:
router.route("/image/:id").post((req, res) => {
  // Create object to update:
  img = {};
  img.id = req.params.id;
  img.heading = req.body.heading;
  img.description = req.body.description;
  img.photographer = req.body.photographer;
  img.usercreate = req.body.usercreate;
  image.update(img, (err, row) => {
    if (err) res.send(err);
    res.json("Update successful");
  });
});

// Ajax update:
router.route("/image/ajax/:id").post((req, res) => {
  // Create object to update:
  img = {};
  img.id = req.params.id;
  img.heading = req.body.heading;
  img.description = req.body.description;
  img.photographer = req.body.photographer;
  image.ajaxUpdate(img, (err, row) => {
    if (err) res.send(err);
    res.json("Updated successfully");
  });
});

// Delete image info:
router.route("/image/delete/:id").get((req, res) => {
  image.delete(req.params.id, (err, result) => {
    if (err) {
      res.send(err);
    }
    res.redirect("/image");
  });
});

// Detect faces on image and smart crop:
router.route("/image/crop-image/faces").post((req, res) => {
  image.cropImage(req, res, (err, result) => {
    if (err) {
      res.json(err);
    }
    res.json(result);
  });
});
// Manual crop:
router.post("/crop-manual", (req, res) => {
  let data = req.body.imgBase64;
  let objimg = req.body.img;
  let dstDir = objimg.media;
  let filename = objimg.medialist.articlePreview;
  let dirRoot = path.dirname(require.main.filename).replace("\\", "/");
  dstDir = `${dirRoot}/publics${dstDir}`;
  let dst = `${dstDir}/${filename}`;
  let imageBuffer = decodeBase64Image(data, (arg) => {
    fs.writeFile(dst, arg.data, (err) => {
      if (err) {
        res.json(err);
      } else {
        res.json("Croped successfully");
      }
    });
  });
});

function decodeBase64Image(dataString, callback) {
  let matches = dataString.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
  let response = {};
  if (matches.length !== 3) {
    return new Error("Invalid input string");
  }
  response.type = matches[1];
  response.data = new Buffer(matches[2], "base64");
  callback(response);
  return response;
}


module.exports = router;
