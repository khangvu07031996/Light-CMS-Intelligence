module.exports = {
    
    initImageSize: function (im, x, y, width, height) {
        let _x, _y, _width, _height;
        let w = width / 2, h = height / 2;
        let obj = {};

        if (x - w < 0) {
            _x = 0;
        } else {
            _x = x - w;
        }
        if (y - (h / 2) < 0) {
            _y = 0;
        } else {
            _y = y - (h / 2);
        }
        if (2 * width > im.width() - _x) {
            _width = im.width() - _x;
        } else {
            _width = 2 * width;
        }
        if (2 * height > im.height() - _y) {
            _height = img.height() - _y;
        } else {
            _height = 2 * height;
        }

        obj.x = _x;
        obj.y = _y;
        obj.width = _width;
        obj.height = _height;

        return obj;
    }

}