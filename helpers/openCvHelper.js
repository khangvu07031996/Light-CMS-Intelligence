
const cv = require("opencv");
const cropHelper = require("./cropHelper");

module.exports = {
  defaultCropFaces(path) {
    cv.readImage(path, (err, im) => {
      im.detectObject(cv.FACE_CASCADE, {}, (errDetect, faces) => {
        let c = 0;
        for (let i = 0; i < faces.length; i++) {
          let x = faces[i];
          im.ellipse(x.x + (x.width / 2), x.y + (x.height / 2),
            x.width / 2, x.height / 2);
          let obj = cropHelper.initImageSize(im, x.x, x.y, x.width, x.height);
          let croppedImg = im.crop(obj.x, obj.y, obj.width, obj.height);
          croppedImg.save(`${c}_face-detection.png`);
          c++;
        }
      });
    });
  },

  cropFaces(src, filename, dstDir, cb, cbResize) {
    cv.readImage(src, (err, im) => {
      im.detectObject(cv.FACE_CASCADE, {}, (error, faces) => {
        let c = 0;
        for (let i = 0; i < faces.length; i++) {
          let x = faces[i];
          let obj = cropHelper.initImageSize(im, x.x, x.y, x.width, x.height);
          let croppedImg = im.crop(obj.x, obj.y, obj.width, obj.height);
          let pathFull = `${dstDir}/${filename}_face_${c}.jpg`;
          croppedImg.save(pathFull);
          c++;
          cbResize(pathFull);
        }
        cb(faces.length);
      });
    });
  },
};
