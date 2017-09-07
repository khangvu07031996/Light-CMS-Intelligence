const fs = require("fs");
const path = require("path");
let mkdirp = require("mkdirp");


module.exports = {

  initCreateDirectory(obj, getDateTimeObject, cb) {
    obj.strDateTime = getDateTimeObject().toString();
    obj.dtObj = getDateTimeObject();
    obj.destDirectory = "";
    obj.moment = Date.now().toString();
    obj.appDir = path.dirname(require.main.filename);

    let dirPublics = path.join(obj.appDir, "publics");
    let dirVpp = path.join(dirPublics, "vpp");
    let dirYear = path.join(dirVpp, obj.dtObj.year);
    let dirMonth = path.join(dirYear, obj.dtObj.month);
    let dirDay = path.join(dirMonth, obj.dtObj.day);
    let dirMoment = path.join(dirDay, obj.moment);

    obj.destDirectory = dirMoment;
    obj.virtualDir = `/vpp/${obj.dtObj.year}/${obj.dtObj.month}/${obj.dtObj.day}/${obj.moment}`;
    cb(dirPublics, dirVpp, dirYear, dirMonth, dirDay, dirMoment);
  },

  // Get data about year, month, day:
  getDateTimeObject() {
    let date = new Date();
    let hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    let min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    let sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    let year = `${date.getFullYear()}`;
    let month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    let day = date.getDate();
    day = (day < 10 ? "0" : "") + day;
    let strDate = `${year}${month}${day}${hour}${min}${sec}`;
    let obj = {
      year,
      month,
      day,
      hour,
      min,
      sec,
      toString() {
        // console.log('this is to string of obj');
        return strDate;
      },
    };
    // console.log(obj);
    return obj;
  },

  createDirectory(dirPublics, dirVpp, dirYear, dirMonth, dirDay, dirMoment) {
    /*
    mkdirp(dirPublics, (errpl) => {
      // path was created unless there was error
      console.log(`Create directory with error: ${errpl}`);
      mkdirp(dirVpp, (errvpp) => {
        // path was created unless there was error
        console.log(`Create directory with error: ${errvpp}`);
        mkdirp(dirYear, (erryear) => {
          // path was created unless there was error
          console.log(`Create directory with error: ${erryear}`);
          mkdirp(dirMonth, (errmth) => {
            // path was created unless there was error
            console.log(`Create directory with error: ${errmth}`);
            mkdirp(dirDay, (errday) => {
              // path was created unless there was error
              console.log(`Create directory with error: ${errday}`);
              mkdirp(dirMoment, (errmoment) => {
                // path was created unless there was error
                console.log(`Create directory with error: ${errmoment}`);
              });
            });
          });
        });
      });
    });
    */
    /*
    fs.access(dirPublics, (err) => {
      if (err) {
        fs.mkdirSync(dirPublics);
      }
    });
    fs.access(dirVpp, (err) => {
      if (err) {
        fs.mkdirSync(dirVpp);
      }
    });
    fs.access(dirYear, (err) => {
      if (err) {
        fs.mkdirSync(dirYear);
      }
    });
    fs.access(dirMonth, (err) => {
      if (err) {
        fs.mkdirSync(dirMonth);
      }
    });
    fs.access(dirDay, (err) => {
      if (err) {
        fs.mkdirSync(dirDay);
      }
    });
    fs.access(dirMoment, (err) => {
      console.log(`--dirMoment = ${dirMoment}`);
      if (err) {
        fs.mkdirSync(dirMoment);
      }
    });
    */
    fs.access(dirPublics, (err) => {
      if (err) {
        fs.mkdirSync(dirPublics);
      }
      fs.access(dirVpp, (err) => {
        if (err) {
          fs.mkdirSync(dirVpp);
        }
        fs.access(dirYear, (err) => {
          if (err) {
            fs.mkdirSync(dirYear);
          }
          fs.access(dirMonth, (err) => {
            if (err) {
              fs.mkdirSync(dirMonth);
            }
            fs.access(dirDay, (err) => {
              if (err) {
                fs.mkdirSync(dirDay);
              }
              fs.access(dirMoment, (err) => {
                console.log(`--dirMoment = ${dirMoment}`);
                if (err) {
                  fs.mkdirSync(dirMoment);
                }
              });
            });
          });
        });
      });
    });
  }
};
