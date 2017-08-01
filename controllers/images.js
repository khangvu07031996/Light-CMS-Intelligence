var express = require('express')
    , router = express.Router();
var fs = require('fs');
const path = require('path');
var image = require('../models/image');


/*
var strDateTime = getDateTimeObject().toString();
var dtObj = getDateTimeObject();
var destDirectory = "";
var moment = Date.now().toString();
*/
var strDateTime;
var dtObj;
var destDirectory = "";
var virtualDir = "";
var moment;
//Variable medialist:
var original, teaser, searchResult, articlePreview;
var bn = false;


function createDirectory() {
    console.log('-------------------------createDir');
    strDateTime = getDateTimeObject().toString();
    dtObj = getDateTimeObject();
    destDirectory = "";
    moment = Date.now().toString();

    var path = require('path');
    var appDir = path.dirname(require.main.filename);

    console.log(appDir);
    console.log(require.main.filename);

    console.log('-----' + moment);
    console.log('obj.toString = ' + dtObj.toString());


    let destDir = path.join(appDir, 'publics');
    //console.log("---" + destDir);
    //console.log(dtObj);

    let destDir0 = path.join(destDir, 'vpp');
    let destDir1 = path.join(destDir0, dtObj.year);
    let destDir2 = path.join(destDir1, dtObj.month);
    let destDir3 = path.join(destDir2, dtObj.day);
    let destDir4 = path.join(destDir3, moment);

    destDirectory = destDir4;
    virtualDir = '/vpp' + '/' + dtObj.year + '/' + dtObj.month + '/' + dtObj.day + '/' + moment;
    console.log('log = ' + virtualDir);

    fs.access(destDir, (err) => {
        if (err)
            fs.mkdirSync(destDir);

    });
    fs.access(destDir0, (err) => {
        if (err)
            fs.mkdirSync(destDir0);

    });
    fs.access(destDir1, (err) => {
        if (err)
            fs.mkdirSync(destDir1);

    });
    fs.access(destDir2, (err) => {
        if (err)
            fs.mkdirSync(destDir2);
    });
    fs.access(destDir3, (err) => {
        if (err)
            fs.mkdirSync(destDir3);

    });
    fs.access(destDir4, (err) => {
        if (err)
            fs.mkdirSync(destDir4);
        
    });
   
}



var multer = require('multer');

//Tạo thư mục:
router.get('/image/createDirectory', function(req, res) {
    createDirectory();
    res.send("Created Directory");
})

router.get('/image/data', function (req, res) {   
    
    image.all(req, res, function(result) {
        //console.log('result------ = ' + result);
        res.send(result);
    });
});

router.post('/image/dataByMoment', function (req, res) {   
    
    image.getDataByMoment(req, res, function(result) {
        //console.log('result------ = ' + result);
        res.send(result);
    });
});

router.post('/image/databyid', function (req, res) {   
    
    image.getDataByID(req, res, function(result) {
        console.log('result by id = ' + result);
        res.send(result);
    });
});


router.get('/image', function (req, res) {
    
    createDirectory();

    
    image.getAll(req, res, function(result) {
        console.log('result0000000000 = ' + result);
        //res.send(result);

    });  
    
    
});
   
var arrPath = [];
var count = 0;
var storage = multer.diskStorage({

    destination: function (req, file, cb) {

        //createDirectory();

        cb(null, destDirectory);
    },
    
    filename: function(req, file, cb) {
        var strDate = moment;
        strDate = strDate + '_' + count + '.jpg';
        count++;
        //var strDate1 = getDateTimeObject().toString() + '.jpg';

        //original = 'Original_' + strDate + '_' + file.originalname;
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

router.post('/image/upload', upload.any(), function (req, res) {

 
    //console.log(req.file);
    //res.send("Upload successful");
    //image.upload(req, res);
    //console.log('length = ' + arrPath.length);
    //image.insert(req, res, function (err, img) {
        //console.log('inserted!');
    //});
    

    console.log(arrPath);
    console.log("moment..... = " + moment);
    for (var i = 0; i < arrPath.length; i++) {
        var obj = {
       
            articlePreview: arrPath[i],
            path: virtualDir,
            moment: moment
        };
        image.insert(req, res, null, obj, function (err, img) {
            console.log('inserted!');
        });
    }

    //reset:
    arrPath = [];
    count = 0;
    //res.send("Upload successful");
    //res.redirect('/AuthorForm')
    res.send(moment);
});

router.route('/image/:image_id').get(function (req, res) {

    image.edit(req, res);
});

router.route('/image/:image_id').put(function (req, res) {
    image.update(req, res);

});

router.route('/image/:image_id').delete(function (req, res) {
    console.log('_id = ' + req.params.image_id)
    image.delete(req, res);
}); 


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
            console.log('this is to string of obj');
            return strDate;
        }
    };
    console.log(obj);
    return obj;

}

module.exports = router;
