module.exports = {
    createDirectory: function () {
        //console.log('---createDir');
        strDateTime = getDateTimeObject().toString();
        dtObj = getDateTimeObject();
        destDirectory = "";
        moment = Date.now().toString();
        //let path = require('path');
        var appDir = path.dirname(require.main.filename);
    
        console.log(appDir);
    
        let destDir = path.join(appDir, 'publics');
        let dirVpp = path.join(destDir, 'vpp');
        let dirYear = path.join(dirVpp, dtObj.year);
        let dirMonth = path.join(dirYear, dtObj.month);
        let dirDay = path.join(dirMonth, dtObj.day);
        let dirMoment = path.join(dirDay, moment);
    
        destDirectory = dirMoment;
        virtualDir = '/vpp' + '/' + dtObj.year + '/' + dtObj.month + '/' + dtObj.day + '/' + moment;
    
        fs.access(destDir, (err) => {
            if (err)
                fs.mkdirSync(destDir);
    
        });
        fs.access(dirVpp, (err) => {
            if (err)
                fs.mkdirSync(dirVpp);
    
        });
        fs.access(dirYear, (err) => {
            if (err)
                fs.mkdirSync(dirYear);
    
        });
        fs.access(dirMonth, (err) => {
            if (err)
                fs.mkdirSync(dirMonth);
        });
        fs.access(dirDay, (err) => {
            if (err)
                fs.mkdirSync(dirDay);
    
        });
        fs.access(dirMoment, (err) => {
            if (err)
                fs.mkdirSync(dirMoment);
    
        });
    
    },

    //Get data about year, month, day:
    getDateTimeObject: function () {

        var date = new Date();

        var hour = date.getHours();
        hour = (hour < 10 ? "0" : "") + hour;

        var min = date.getMinutes();
        min = (min < 10 ? "0" : "") + min;

        var sec = date.getSeconds();
        sec = (sec < 10 ? "0" : "") + sec;

        var year = date.getFullYear() + "";

        // var month = date.getMonth() + 1;
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
                //console.log('this is to string of obj');
                return strDate;
            }
        };
        //console.log(obj);
        return obj;

    }
}