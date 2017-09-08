
let fs = require("fs");
let easyimg = require("./easyimage.js");
let imagemagick = require("./imagemagick.js");

function resizeImgHeight(path, dst, height) {
  imagemagick.resize({
    srcPath: path,
    dstPath: dst,
    height
  }, (err, stdout, stderr) => {
    if (err) return console.error(err.stack || err);
    return false;
  });
}
function resizeImgWidth(path, dst, width) {
  imagemagick.resize({
    srcPath: path,
    dstPath: dst,
    width
  }, (err, stdout, stderr) => {
    if (err) return console.error(err.stack || err);
    return false;
  });
}

module.exports = {
  info(src) {
    easyimg.info(src).then(
      (file) => {
        console.log(file);
      }, (err) => {
        console.log(err);
      });
  },
  resCrop(src, dst, width, height, cropwidth, cropheight, x, y) {
    easyimg.rescrop({
      src,
      dst,
      width,
      height,
      cropwidth: cropheight,
      cropheight,
      gravity: "NorthWest",
      x,
      y,
    }).then(
      (img) => {
        console.log(`Resized and cropped: ${img.width}x${img.height}`);
      },
      (err) => {
        console.log(err);
      });
  },

  crop(src, dst, cropwidth, cropheight, x, y) {
    easyimg.crop(
      {
        src,
        dst,
        cropwidth,
        cropheight,
        gravity: "NorthWest",
        x,
        y,
      },
      (err, stdout, stderr) => {
        if (err) throw err;
      });
  },

  resize(src, dst, width, height) {
    easyimg.resize(
      { src, dst, width, height },
      (err, stdout, stderr) => {
        if (err) throw err;
      });
  },
  resizeByHeight(objThumbnailName, dirObject, arrPath, setting, i) {
    // Resize image:
    for (let j = 0; j < objThumbnailName.length; j++) {
      let src = `${dirObject.destDirectory}/${arrPath[i]}`;
      let dst = `${dirObject.destDirectory}/${objThumbnailName[j]}`;
      resizeImgHeight(src, dst, setting.objThumbnailDim[j].height);
    }
    return true;
  },
  resizeByWidth(objThumbnailName, dirObject, arrPath, setting, i) {
    // Resize image:
    for (let j = 0; j < objThumbnailName.length; j++) {
      let src = `${dirObject.destDirectory}/${arrPath[i]}`;
      let dst = `${dirObject.destDirectory}/${objThumbnailName[j]}`;
      resizeImgWidth(src, dst, setting.objThumbnailDim[j].width);
    }
    return true;
  }

};

