
let fs = require("fs");
// var outputDir = './output';
// if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
let easyimg = require("../lib/easyimage.js");
// var srcimg = 'kitten.jpg';

module.exports = {
    info(src) {
        easyimg.info(src).then(
            (file) => {
                console.log(file);
            }, (err) => {
                console.log(err);
            });
    },
    rescrop(src, dst, width, height, cropwidth, cropheight, x, y) {
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
            (image) => {
                console.log(`Resized and cropped: ${image.width}x${image.height}`);
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
                console.log("Cropped");
            });
        console.log("Cropped image");
    },

    resize(src, dst, width, height) {
        easyimg.resize(
            { src, dst, width, height },
            (err, stdout, stderr) => {
                if (err) throw err;
                console.log(`Resized to ${width} x ${height}`);
            });
        console.log(`Resized to ${width} x ${height}`);
    },

};

