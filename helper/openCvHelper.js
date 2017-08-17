var cv = require('opencv');
var cropHelper = require('./cropHelper');

module.exports = {
    defaultCropFaces: function(path) {
        cv.readImage(path, function (err, im) {
        im.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
          let c = 0;
          for (var i = 0; i < faces.length; i++) {
            var x = faces[i]
            im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
            //x.save('./tmp/face-detection.png');
            //console.log(x);
            let obj = cropHelper.initImageSize(im, x.x, x.y, x.width, x.height);
            
            console.log(obj);

            //let croppedImg = im.crop(x.x, x.y, x.width * 2, x.height * 2);
            let croppedImg = im.crop(obj.x, obj.y, obj.width, obj.height);
            console.log(croppedImg);
            croppedImg.save(c + '_face-detection.png');
            //let croppedImg = im.crop(x.x, x.y,  x.width, x.height);
            c++;

          }
          //im.save('./out.jpg');

        });
      });
    },

    cropFaces: function(src, filename, dstDir, cb, cbResize) {
      cv.readImage(src, function (err, im) {
      im.detectObject(cv.FACE_CASCADE, {}, function (err, faces) {
        let c = 0;
        for (var i = 0; i < faces.length; i++) {
          var x = faces[i]
          //im.ellipse(x.x + x.width / 2, x.y + x.height / 2, x.width / 2, x.height / 2);
          //x.save('./tmp/face-detection.png');
          //console.log(x);
          let obj = cropHelper.initImageSize(im, x.x, x.y, x.width, x.height);
          
          console.log(obj);

          //let croppedImg = im.crop(x.x, x.y, x.width * 2, x.height * 2);
          let croppedImg = im.crop(obj.x, obj.y, obj.width, obj.height);
          console.log(croppedImg);
		  let pathFull = dstDir + '/' + filename + '_face_' + c + '.jpg';
          croppedImg.save(pathFull);
          //let croppedImg = im.crop(x.x, x.y,  x.width, x.height);
          c++;
		  
		  cbResize(pathFull);

        }
        cb(faces.length);
		

      });
    });
  }
}