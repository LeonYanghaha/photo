/*
* 20170322
* 负责产生一个随机的字符串，并且加上时间戳。用于用户上传文件时的文件名.
* 文件名的格式是：18位的随机串-时间戳
* */

module.exports = {
    getFileName:function() {

        return UUID()+"-"+timeflage();
    }
};
/*
* 20170322
* 负责产生一个18位的随机串
* */
var UUID =  function(){
    var s = [];
    var hexDigits = "0123456789abcdefghijklmnopqrstvuwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < 18; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 62), 1);
    };
    var uuid = s.join("");
    return uuid;
};

/*
* 20170322
* 负责产生一个当前日期的字符串。
* 字符串的格式是：20170322104545
* */

var timeflage = function(){
    var date = new Date();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var minutes =  date.getMinutes();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (minutes >= 0 && minutes <= 9) {
        minutes = "0" + minutes;
    }
    var currentdate = date.getFullYear() +month + strDate+date.getHours() + minutes + date.getSeconds();
    return currentdate;
};
