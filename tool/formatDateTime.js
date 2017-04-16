/*
* 20170322
* 格式化时间。
* 需要传入一个正则。。用以表示需要的格式，
* 此外：还需要传入一个待格式化的时间
* */
module.exports = {
    formatDateTime: function (fmt,oo) {
     var o = {
         "M+": oo.getMonth() + 1,
         "d+": oo.getDate(),
         "H+": oo.getHours(),
         "m+": oo.getMinutes(),
         "s+": oo.getSeconds(),
         "q+": Math.floor((oo.getMonth() + 3) / 3), //季度
         "S": oo.getMilliseconds()
     };
     if (/(y+)/.test(fmt)) {
         fmt = fmt.replace(RegExp.$1, (oo.getFullYear() + "").substr(4 - RegExp.$1.length));
     }
     for (var k in o){
         if (new RegExp("(" + k + ")").test(fmt)) {
             fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
         }
         }
     return fmt;
    }
};


//var time1 = ss("yyyy-MM-dd",new Date());
//var time2 = ss("yyyy-MM-dd HH:mm:ss",new Date());
