
const express = require("express");
const fs = require("fs");
const path = require("path");
const image = require("../models/image");
const imageHelper = require("../helper/imageHelper");
const directoryHelper = require("../helper/directoryHelper");

let router = express.Router();
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
        count: 7
    }

};
let objThumbnailName = [];

// function create directory:
router.get("/image/createDirectory", (req, res) => {
    directoryHelper.initCreateDirectory(dirObject,
        directoryHelper.getDateTimeObject,
        directoryHelper.createDirectory);
    res.send("Created Directory");
});

// Get only all data:
router.get("/image/data", (req, res) => {
    image.getAll(req, res, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});

router.post("/image/dataByMoment", (req, res) => {
    image.getDataByMoment(req, res, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});

router.post("/image/databyid", (req, res) => {
    image.getDataByID(req, res, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});

// Get all data and render view:
router.get("/image", (req, res) => {
    image.getAll(req, res, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.render("imageForm", { images: result });
    });
});

let multer = require("multer");

let arrPath = [];
let count = 0;
let storage = multer.diskStorage({

    destination(req, file, cb) {
        // createDirectory();
        cb(null, dirObject.destDirectory);
    },

    filename(req, file, cb) {
        let strDate = dirObject.moment;
        strDate = `${strDate}_${count}.jpg`;
        count++;
        original = `Original_${strDate}`;
        arrPath.push(original);
        cb(null, original);
        // cb(null, Date.now().toString() + '-' + file.originalname);
    },

});

let upload = multer({ storage });

// Upload with ajax and insert:
router.post("/image/ajaxUpload", upload.any(), (req, res) => {
    for (let i = 0; i < arrPath.length; i++) {
        let indexOf_ = arrPath[i].indexOf("_");
        let subString = arrPath[i].substring(indexOf_ + 1);

        // Create name of thumbnail images:
        objThumbnailName = [];
        for (let j = 0; j < setting.objThumbnailDim.count; j++) {
            objThumbnailName.push(`${setting.objThumbnailDim[j].width}x${setting.objThumbnailDim[j].height}_${subString}`);
        }
        console.log(objThumbnailName);
        // create object thumbnail:
        let thumbnail = {
            thumbnail_567x330: objThumbnailName[0],
            thumbnail_550x330: objThumbnailName[1],
            thumbnail_400x400: objThumbnailName[2],
            thumbnail_390x240: objThumbnailName[3],
            thumbnail_300x300: objThumbnailName[4],
            thumbnail_112x112: objThumbnailName[5],
            thumbnail_75x75: objThumbnailName[6],

        };

        // Resize image:
        for (let j = 0; j < objThumbnailName.length; j++) {
            let src = `${dirObject.destDirectory}/${arrPath[i]}`;
            let dst = `${dirObject.destDirectory}/${objThumbnailName[j]}`;
            let name = objThumbnailName[j];
            imageHelper.resize(src, dst, setting.objThumbnailDim[j].width,
                setting.objThumbnailDim[j].height);
        }

        let obj = {

            articlePreview: arrPath[i],
            path: dirObject.virtualDir,
            moment: dirObject.moment,
            thumbnail,
        };
        image.insert(req, res, null, obj, (err, img) => {
            console.log("inserted!");
        });
    }

    // reset:
    arrPath = [];
    count = 0;

    res.send(dirObject.moment);
});
// Upload image:
router.post("/image/upload", upload.any(), (req, res) => {
    // res.redirect('/image');
    res.json("Inserted");
});
// Insert image infomation:
router.post("/image/insert", (req, res) => {
    for (let i = 0; i < arrPath.length; i++) {
        let indexOf_ = arrPath[i].indexOf("_");
        let subString = arrPath[i].substring(indexOf_ + 1);

        // Create name of thumbnail images:
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
            thumbnail_75x75: objThumbnailName[6],

        };
        // Resize image:
        for (let j = 0; j < objThumbnailName.length; j++) {
            let src = `${dirObject.destDirectory}/${arrPath[i]}`;
            let dst = `${dirObject.destDirectory}/${objThumbnailName[j]}`;
            imageHelper.resize(src, dst, setting.objThumbnailDim[j].width,
                setting.objThumbnailDim[j].height);
        }
        let objinfo = {
            articlePreview: arrPath[i],
            path: dirObject.virtualDir,
            moment: dirObject.moment,
            thumbnail,
        };
        image.insert(req, res, objinfo, null, (err, img) => {
            console.log("inserted!");
        });
    }
    // reset:
    arrPath = [];
    count = 0;
    // res.redirect('/image');
    res.json("Inserted");
});


router.get("/image/add", (req, res) => {
    res.render("addImage");
});
// render form edit:
router.route("/image/:image_id").get((req, res) => {
    image.edit(req, res, (err, row) => {
        if (err) res.send(err);
        res.render("editImage", { image: row });
    });
});
// update image and render form list images:
router.route("/image/:image_id").post((req, res) => {
    console.log("This is controller update");
    image.update(req, res, (err, row) => {
        if (err) res.send(err);
        res.json("Update successful");
    });
    // res.redirect('/image');
});

// Ajax update:
router.route("/image/ajax/:image_id").post((req, res) => {
    image.ajaxUpdate(req, res, (err, row) => {
        if (err) res.send(err);
        res.json("Update successful");
    });
});

// Delete image info:
router.route("/image/delete/:image_id").get((req, res) => {
    // console.log('_id = ' + req.params.image_id)
    image.delete(req, res, (err, result) => {
        if (err) {
            res.send(err);
        }
        // res.json({ message: 'Successfully deleted' });
        res.redirect("/image");
    });
});

// Detect faces on image and smart crop:
router.route("/image/cropImage/faces").post((req, res) => {
    console.log(`controller : id = ${req.body.id}`);
    image.cropImage(req, res, (err, result) => {
        if (err) {
            res.json(err);
        }
        res.json(result);
    });
});
// Manual crop:
router.post("/urlsave", (req, res) => {
    let data = req.body.imgBase64;
    let objimg = req.body.img;
    console.log(`data = ${data}`);
    let dstDir = objimg.media;
    let filename = objimg.medialist.articlePreview;
    let dirRoot = path.dirname(require.main.filename).replace("\\", "/");

    dstDir = `${dirRoot}/publics${dstDir}`;
    // filename = `cropmanual_${filename}`;
    let dst = `${dstDir}/${filename}`;
    let imageBuffer = decodeBase64Image(data, (arg) => {
        fs.writeFile(dst, arg.data, (err) => {
            if (err) {
                res.json(err);
            } else {
                res.json("Saved image");
            }
        });
    });
    // console.log(imageBuffer);
});

function decodeBase64Image(dataString, cb) {
    let matches = dataString.match(/^data:([A-Za-z-+\\/]+);base64,(.+)$/);
    let response = {};

    if (matches.length !== 3) {
        return new Error("Invalid input string");
    }

    response.type = matches[1];
    response.data = new Buffer(matches[2], "base64");

    cb(response);

    return response;
}


module.exports = router;
