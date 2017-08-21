var express = require('express')
    , router = express.Router()
    , fs = require('fs');
const path = require('path');
var image = require('../models/image');
var imageHelper = require('../helper/imageHelper');
var openCvHelper = require('../helper/openCvHelper');

var strDateTime;
var dtObj;
var destDirectory = "";
var virtualDir = "";
var moment;
//Variable medialist:
var original, teaser, searchResult, articlePreview;
var bn = false;
var arrobjThumbnails = [{ width: 567, height: 330 },
                        { width: 550, height: 330 },
                        { width: 390, height: 240 },
                        { width: 112, height: 112 }];
var arrThumbnail = ["", "", "", ""];

function createDirectory() {
    //console.log('---createDir');
    strDateTime = getDateTimeObject().toString();
    dtObj = getDateTimeObject();
    destDirectory = "";
    moment = Date.now().toString();
    //let path = require('path');
    var appDir = path.dirname(require.main.filename);

    console.log(appDir);

    let destDir = path.join(appDir, 'publics');
    let dirVpp = path.join(destDir, 'vpp');
    let dirYear = path.join(dirVpp, dtObj.year);
    let dirMonth = path.join(dirYear, dtObj.month);
    let dirDay = path.join(dirMonth, dtObj.day);
    let dirMoment = path.join(dirDay, moment);

    destDirectory = dirMoment;
    virtualDir = '/vpp' + '/' + dtObj.year + '/' + dtObj.month + '/' + dtObj.day + '/' + moment;

    fs.access(destDir, (err) => {
        if (err)
            fs.mkdirSync(destDir);

    });
    fs.access(dirVpp, (err) => {
        if (err)
            fs.mkdirSync(dirVpp);

    });
    fs.access(dirYear, (err) => {
        if (err)
            fs.mkdirSync(dirYear);

    });
    fs.access(dirMonth, (err) => {
        if (err)
            fs.mkdirSync(dirMonth);
    });
    fs.access(dirDay, (err) => {
        if (err)
            fs.mkdirSync(dirDay);

    });
    fs.access(dirMoment, (err) => {
        if (err)
            fs.mkdirSync(dirMoment);

    });

}


//function create directory:
router.get('/image/createDirectory', function (req, res) {
    createDirectory();
    res.send("Created Directory");
});

//Get only all data:
router.get('/image/data', function (req, res) {

    image.getAll(req, res, function (err, result) {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});

router.post('/image/dataByMoment', function (req, res) {
    image.getDataByMoment(req, res, function (err, result) {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});

router.post('/image/databyid', function (req, res) {

    image.getDataByID(req, res, function (err, result) {
        if (err) {
            res.send(err);
        }
        res.send(result);
    });
});

//Get all data and render view:
router.get('/image', function (req, res) {
    //openCvHelper.cropFaces('faces.jpg');

    //createDirectory();

    image.getAll(req, res, function (err, result) {
        if (err) {
            res.send(err);
        }
        res.render('imageForm', { images: result });

    });

});



var multer = require('multer');
var arrPath = [];
var count = 0;
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
        //createDirectory();
        cb(null, destDirectory);
    },

    filename: function (req, file, cb) {
        var strDate = moment;
        strDate = strDate + '_' + count + '.jpg';
        count++;

        original = 'Original_' + strDate;
        // teaser = 'Teaser_' + strDate ;
        // searchResult = 'SearchResul_' + strDate;
        // articlePreview = 'ArticlePreview_' + strDate;

        arrPath.push(original);
        cb(null, original);

        //cb(null, Date.now().toString() + '-' + file.originalname);

    }

});

var upload = multer({ storage: storage });

//Upload with ajax and insert:
router.post('/image/ajaxUpload', upload.any(), function (req, res) {

    console.log(arrPath);
    console.log("moment..... = " + moment);
    for (var i = 0; i < arrPath.length; i++) {
        let indexOf_ = arrPath[i].indexOf("_");
        let subString = arrPath[i].substring(indexOf_ + 1);

        //Create name of thumbnail images:
        arrThumbnail[0] = "567x330" + "_" + subString;
        arrThumbnail[1] = "550x330" + "_" + subString;
        arrThumbnail[2] = "390x240" + "_" + subString;
        arrThumbnail[3] = "112x112" + "_" + subString;

        //create object thumbnail:
        let thumbnail = {
            thumbnail_567x330: arrThumbnail[0],
            thumbnail_550x330: arrThumbnail[1],
            thumbnail_390x240: arrThumbnail[2],
            thumbnail_112x112: arrThumbnail[3]

        }

        //Resize image:
        for (let j = 0; j < arrThumbnail.length; j++) {
            let src = destDirectory + "/" + arrPath[i];
            let dst = destDirectory + "/" + arrThumbnail[j];
            imageHelper.resize(src, dst, arrobjThumbnails[j].width, arrobjThumbnails[j].height);
        }

        let obj = {

            articlePreview: arrPath[i],
            path: virtualDir,
            moment: moment,
            thumbnail: thumbnail
        };
        image.insert(req, res, null, obj, function (err, img) {
            console.log('inserted!');
        });
    }

    //reset:
    arrPath = [];
    count = 0;

    res.send(moment);
});
//Upload image:
router.post('/image/upload', upload.any(), function (req, res) {    
   
    //res.redirect('/image');
	res.json('Inserted');

});
//Insert image infomation:
router.post('/image/insert', function (req, res) {

    for (var i = 0; i < arrPath.length; i++) {
		let indexOf_ = arrPath[i].indexOf("_");
        let subString = arrPath[i].substring(indexOf_ + 1);

        //Create name of thumbnail images:
        arrThumbnail[0] = "567x330" + "_" + subString;
        arrThumbnail[1] = "550x330" + "_" + subString;
        arrThumbnail[2] = "390x240" + "_" + subString;
        arrThumbnail[3] = "112x112" + "_" + subString;

        //create object thumbnail:
        let thumbnail = {
            thumbnail_567x330: arrThumbnail[0],
            thumbnail_550x330: arrThumbnail[1],
            thumbnail_390x240: arrThumbnail[2],
            thumbnail_112x112: arrThumbnail[3]

        }

        //Resize image:
        for (let j = 0; j < arrThumbnail.length; j++) {
            let src = destDirectory + "/" + arrPath[i];
            let dst = destDirectory + "/" + arrThumbnail[j];
            imageHelper.resize(src, dst, arrobjThumbnails[j].width, arrobjThumbnails[j].height);
        }

        
		
        let objinfo = {

            articlePreview: arrPath[i],
            path: virtualDir,
            moment: moment,
			thumbnail: thumbnail
        };
        image.insert(req, res, objinfo, null, function (err, img) {
            console.log('inserted!');
        });
    }

    //reset:
    arrPath = [];
    count = 0;

    //res.redirect('/image');
	res.json('Inserted');

});


router.get("/image/add", function (req, res) {
    res.render('addImage');
})
//render form edit:
router.route('/image/:image_id').get(function (req, res) {

    image.edit(req, res, function (err, row) {
        if (err) res.send(err);
        //res.json(rows);
        console.log('image: ');
        console.log(row);
        res.render('editImage', { image: row });
    });
});
//update image and render form list images:
router.route('/image/:image_id').post(function (req, res) {
	console.log('This is controller update');
    image.update(req, res);
    //res.redirect('/image');
	res.json('Update successful');

});

//Ajax update:
router.route('/image/ajax/:image_id').post(function (req, res) {

    image.ajaxUpdate(req, res);


});

//Delete image info:
router.route('/image/delete/:image_id').get(function (req, res) {
    console.log('_id = ' + req.params.image_id)
    image.delete(req, res, function (err, result) {
        if (err) {
            res.send(err);
        }
        //res.json({ message: 'Successfully deleted' });
        res.redirect('/image');
    });
});

//Detect faces on image and smart crop:
router.route('/image/cropImage/faces').post(function(req, res) {
    console.log('controller : id = ' + req.body.id)
    image.cropImage(req, res, function (err, result) {
        if (err) {
            res.json(err);
        }
        res.json(result);
       
    });
    
});
//Manual crop:
router.post('/urlsave', function(req, res) {
    let data = req.body.imgBase64;
    let objimg = req.body.img;    
    console.log('data = ' + data);

    let dstDir = objimg.media;
    let filename = objimg.medialist.articlePreview;
    let dirRoot = path.dirname(require.main.filename).replace("\\", "\/");  

    dstDir = dirRoot + "/publics" + dstDir;
    filename = "cropmanual_" + filename;
    let dst = dstDir + "/" + filename;
        
    var imageBuffer = decodeBase64Image(data, function(arg) {
        fs.writeFile(dst, arg.data, function(err) {
            res.json('Saved image');
        });
    });
    console.log(imageBuffer);
    
});

function decodeBase64Image(dataString, cb) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');

    cb(response);
  
    return response;
  }
  

//Get data about year, month, day:
function getDateTimeObject() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear() + "";

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    var strDate0 = year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;
    var strDate = year + "" + month + "" + day + "" + hour + "" + min + "" + sec;



    var obj = {
        year: year,
        month: month,
        day: day,
        hour: hour,
        min: min,
        sec: sec,

        toString: function () {
            //console.log('this is to string of obj');
            return strDate;
        }
    };
    //console.log(obj);
    return obj;

}

module.exports = router;
