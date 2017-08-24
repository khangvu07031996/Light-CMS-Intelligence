
const express = require("express");

const router = express.Router();
const fs = require("fs");
const path = require("path");
const image = require("../models/image");
const imageHelper = require("../helper/imageHelper");
// const openCvHelper = require("../helper/openCvHelper");
var strDateTime;

let dtObj;
let destDirectory = "";
let virtualDir = "";
let moment;
// Variable medialist:
let original;
// let teaser;
// let searchResult;
// let    articlePreview;

const arrobjThumbnails = [{ width: 567, height: 330 },
{ width: 550, height: 330 },
{ width: 390, height: 240 },
{ width: 112, height: 112 }];
const arrThumbnail = ["", "", "", ""];

function createDirectory() {
    // console.log('---createDir');
    strDateTime = getDateTimeObject().toString();
    dtObj = getDateTimeObject();
    destDirectory = "";
    moment = Date.now().toString();
    // let path = require('path');
    const appDir = path.dirname(require.main.filename);

    console.log(appDir);

    const destDir = path.join(appDir, "publics");
    const dirVpp = path.join(destDir, "vpp");
    const dirYear = path.join(dirVpp, dtObj.year);
    const dirMonth = path.join(dirYear, dtObj.month);
    const dirDay = path.join(dirMonth, dtObj.day);
    const dirMoment = path.join(dirDay, moment);

    destDirectory = dirMoment;
    virtualDir = `/vpp/${dtObj.year}/${dtObj.month}/${dtObj.day}/${moment}`;

    fs.access(destDir, (err) => {
        if (err) { fs.mkdirSync(destDir); }
    });
    fs.access(dirVpp, (err) => {
        if (err) { fs.mkdirSync(dirVpp); }
    });
    fs.access(dirYear, (err) => {
        if (err) { fs.mkdirSync(dirYear); }
    });
    fs.access(dirMonth, (err) => {
        if (err) { fs.mkdirSync(dirMonth); }
    });
    fs.access(dirDay, (err) => {
        if (err) { fs.mkdirSync(dirDay); }
    });
    fs.access(dirMoment, (err) => {
        if (err) { fs.mkdirSync(dirMoment); }
    });
}


// function create directory:
router.get("/image/createDirectory", (req, res) => {
    createDirectory();
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
    // openCvHelper.cropFaces('faces.jpg');
    // createDirectory();
    image.getAll(req, res, (err, result) => {
        if (err) {
            res.send(err);
        }
        res.render("imageForm", { images: result });
    });
});


const multer = require("multer");

let arrPath = [];
let count = 0;
const storage = multer.diskStorage({

    destination(req, file, cb) {
        // createDirectory();
        cb(null, destDirectory);
    },

    filename(req, file, cb) {
        let strDate = moment;
        strDate = `${strDate}_${count}.jpg`;
        count++;

        original = `Original_${strDate}`;
        // teaser = 'Teaser_' + strDate ;
        // searchResult = 'SearchResul_' + strDate;
        // articlePreview = 'ArticlePreview_' + strDate;

        arrPath.push(original);
        cb(null, original);

        // cb(null, Date.now().toString() + '-' + file.originalname);
    },

});

const upload = multer({ storage });

// Upload with ajax and insert:
router.post("/image/ajaxUpload", upload.any(), (req, res) => {
    console.log(arrPath);
    console.log(`moment..... = ${moment}`);
    for (let i = 0; i < arrPath.length; i++) {
        const indexOf_ = arrPath[i].indexOf("_");
        const subString = arrPath[i].substring(indexOf_ + 1);

        // Create name of thumbnail images:
        arrThumbnail[0] = `567x330_${subString}`;
        arrThumbnail[1] = `550x330_${subString}`;
        arrThumbnail[2] = `390x240_${subString}`;
        arrThumbnail[3] = `112x112_${subString}`;

        // create object thumbnail:
        const thumbnail = {
            thumbnail_567x330: arrThumbnail[0],
            thumbnail_550x330: arrThumbnail[1],
            thumbnail_390x240: arrThumbnail[2],
            thumbnail_112x112: arrThumbnail[3],

        };

        // Resize image:
        for (let j = 0; j < arrThumbnail.length; j++) {
            const src = `${destDirectory}/${arrPath[i]}`;
            const dst = `${destDirectory}/${arrThumbnail[j]}`;
            imageHelper.resize(src, dst, arrobjThumbnails[j].width, arrobjThumbnails[j].height);
        }
        const obj = {
            articlePreview: arrPath[i],
            path: virtualDir,
            moment,
            thumbnail,
        };
        image.insert(req, res, null, obj, (err, img) => {
            console.log("inserted!");
        });
    }

    // reset:
    arrPath = [];
    count = 0;

    res.send(moment);
});
// Upload image:
router.post("/image/upload", upload.any(), (req, res) => {
    // res.redirect('/image');
    res.json("Inserted");
});
// Insert image infomation:
router.post("/image/insert", (req, res) => {
    for (let i = 0; i < arrPath.length; i++) {
        const indexOf_ = arrPath[i].indexOf("_");
        const subString = arrPath[i].substring(indexOf_ + 1);

        // Create name of thumbnail images:
        arrThumbnail[0] = `567x330_${subString}`;
        arrThumbnail[1] = `550x330_${subString}`;
        arrThumbnail[2] = `390x240_${subString}`;
        arrThumbnail[3] = `112x112_${subString}`;

        // create object thumbnail:
        const thumbnail = {
            thumbnail_567x330: arrThumbnail[0],
            thumbnail_550x330: arrThumbnail[1],
            thumbnail_390x240: arrThumbnail[2],
            thumbnail_112x112: arrThumbnail[3],

        };

        // Resize image:
        for (let j = 0; j < arrThumbnail.length; j++) {
            const src = `${destDirectory}/${arrPath[i]}`;
            const dst = `${destDirectory}/${arrThumbnail[j]}`;
            imageHelper.resize(src, dst, arrobjThumbnails[j].width, arrobjThumbnails[j].height);
        }


        const objinfo = {

            articlePreview: arrPath[i],
            path: virtualDir,
            moment,
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
        // res.json(rows);
        console.log("image: ");
        console.log(row);
        res.render("editImage", { image: row });
    });
});
// update image and render form list images:
router.route("/image/:image_id").post((req, res) => {
    console.log("This is controller update");
    image.update(req, res);
    // res.redirect('/image');
    res.json("Update successful");
});

// Ajax update:
router.route("/image/ajax/:image_id").post((req, res) => {
    image.ajaxUpdate(req, res);
});

// Delete image info:
router.route("/image/delete/:image_id").get((req, res) => {
    console.log(`_id = ${req.params.image_id}`);
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
    const data = req.body.imgBase64;
    const objimg = req.body.img;
    console.log(`data = ${data}`);

    let dstDir = objimg.media;
    let filename = objimg.medialist.articlePreview;
    const dirRoot = path.dirname(require.main.filename).replace("\\", "/");

    dstDir = `${dirRoot}/publics${dstDir}`;
    filename = `cropmanual_${filename}`;
    const dst = `${dstDir}/${filename}`;

    const imageBuffer = decodeBase64Image(data, (arg) => {
        fs.writeFile(dst, arg.data, (err) => {
            res.json("Saved image");
        });
    });
    console.log(imageBuffer);
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


// Get data about year, month, day:
function getDateTimeObject() {
    const date = new Date();

    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    let min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    let sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    const year = `${date.getFullYear()}`;

    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    let day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    const strDate0 = `${year}:${month}:${day}:${hour}:${min}:${sec}`;
    const strDate = `${year}${month}${day}${hour}${min}${sec}`;


    const obj = {
        year,
        month,
        day,
        hour,
        min,
        sec,

        toString() {
            // console.log('this is to string of obj');
            return strDate;
        },
    };
    // console.log(obj);
    return obj;
}

module.exports = router;
