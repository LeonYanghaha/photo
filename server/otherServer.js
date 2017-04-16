/**
 * 20170323
 * other的server层
 */
var otherDao = require('../dao/otherDao.js');
module.exports = {
    /*
     * 20170323
     * 加载县
     * */
    getArea:function(data,cb) {
        otherDao.getArea(data, cb);
    },    /*
     * 20170323
     * 加载市
     * */
    getCity:function(data,cb) {
        otherDao.getCity(data, cb);
    },
    /*
     * 20170323
     * 加载省
     * */
    getProvice:function(cb) {
        otherDao.getProvice( cb);
    }
}

