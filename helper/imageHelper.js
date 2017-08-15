
var fs = require('fs');
//var outputDir = './output';
//if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

var easyimg = require('../lib/easyimage.js');
//var srcimg = 'kitten.jpg';

module.exports = {
    info : function (src) {
         easyimg.info(src).then(
            function(file) {
                console.log(file);
            }, function (err) {
                console.log(err);
            });

    },       
    rescrop: function(src, dst, width, height, cropwidth, cropheight, x, y) {
        easyimg.rescrop({
            src: src, dst: dst,
            width: width, height: height,
            cropwidth: cropheight, cropheight: cropheight,
            gravity:'NorthWest',
            x: x, 
            y: y
        }).then(
        function(image) {
            console.log('Resized and cropped: ' + image.width + ' x ' + image.height);
        },
        function (err) {
            console.log(err);
        });
    },

    crop: function crop(src, dst, cropwidth, cropheight, x, y) {
            easyimg.crop(
                {
                    src: src, dst: dst,
                    cropwidth:cropwidth, cropheight:cropheight,
                    gravity:'NorthWest',
                    x:x, 
                    y:y
                },
                function(err, stdout, stderr) {
                    if (err) throw err;
                    console.log('Cropped');
                }
            );
            console.log('Cropped image');
        },

    resize: function(src, dst, width, height) {
        
        easyimg.resize(
            {src:src, dst:dst, width:width, height:height}, 
            function(err, stdout, stderr) {
                if (err) throw err;
                console.log('Resized to ' + width + ' x ' + height);
        });
        console.log('Resized to ' + width + ' x ' + height);

    }
     
}








