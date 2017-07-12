var express = require('express')
    , router = express.Router();
var fs = require('fs');
const path = require('path');
var image = require('../models/image');



var strDateTime = getDateTimeObject().toString();
var dtObj = getDateTimeObject();
var destDirectory = "";
var moment = Date.now().toString();



router.get('/image', function (req, res) {
    image.all();
    res.send("This is image controller");
});


var multer = require('multer');


router.get('/image/form', function (req, res) {
    res.render('form');
    //-----------------
    var path = require('path');
    var appDir = path.dirname(require.main.filename);

    console.log(appDir);
    console.log(require.main.filename);
   
    console.log('-----' + moment);
    console.log('obj.toString = ' + dtObj.toString());

    
    let destDir = path.join(appDir, 'publics');
    console.log("---" + destDir);
    console.log(dtObj);
    

    let destDir0 = path.join(destDir, 'vpp');
    let destDir1 = path.join(destDir0, dtObj.year);
    let destDir2 = path.join(destDir1, dtObj.month);
    let destDir3 = path.join(destDir2, dtObj.day);
    let destDir4 = path.join(destDir3, moment);

    destDirectory = destDir4;

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

});


var storage = multer.diskStorage({      

    destination: function (req, file, cb) {
        cb(null, destDirectory);
    },
    filename: function (req, file, cb) {
        var strDate = moment + '.jpg';
        //var strDate1 = getDateTimeObject().toString() + '.jpg';
        cb(null, 'Original_' + strDate);
        //cb(null, 'Original_' + formatted.toString());
        cb(null, 'Teaser_' + strDate);
        cb(null, 'searchResult_' + strDate);
        cb(null, 'articlePreview_' + strDate);
        //cb(null, 'testname_' + strDate1);

    }

});

var upload = multer({ storage: storage });

router.post('/upload', upload.single("file"), function (req, res) {
    
    //upload.single("file");

    //console.log(req.file);
    //res.send("Upload successful");
    image.upload(req, res);
    image.insert(req, res, function (err, img) {
        console.log('inserted!');
    });
    res.send("Upload successful");
})



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