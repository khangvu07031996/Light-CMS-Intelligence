
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
                    // x.save('./tmp/face-detection.png');
                    // console.log(x);
                    let obj = cropHelper.initImageSize(im, x.x, x.y, x.width, x.height);
                    console.log(obj);
                    // let croppedImg = im.crop(x.x, x.y, x.width * 2, x.height * 2);
                    let croppedImg = im.crop(obj.x, obj.y, obj.width, obj.height);
                    console.log(croppedImg);
                    croppedImg.save(`${c}_face-detection.png`);
                    // let croppedImg = im.crop(x.x, x.y,  x.width, x.height);
                    c++;
                }
                // im.save('./out.jpg');
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
                    console.log(obj);
                    let croppedImg = im.crop(obj.x, obj.y, obj.width, obj.height);
                    console.log(croppedImg);
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
