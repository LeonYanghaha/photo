/*
 * 20170323
 * other
 * */
var query = require('./getPool.js');
module.exports = {
    /*
     * 20170323
     * 加载县
     * */
    
    getArea:function(id,cb){
        query('SELECT area_id,area_name ,city_id FROM AREA WHERE city_id = ?;',
            [id],
            function(error,results,fields){
                if(error){
                    console.log("getArea 出错.");
                    console.log(error);
                    cb(0);
                }else{
                    cb(results);
                }
            });
    },
    /*
     * 20170323
     * 加载市
     * 需要传入一个ID
     * 返回所属的市
     * */
    getCity:function(id,cb){
        query('SELECT city_id,city_name ,provice_id FROM city WHERE provice_id = ?;',
            [id],
            function(error,results,fields){
                if(error){
                    console.log("getCity出错.");
                    console.log(error);
                    cb(0);
                }else{
                    cb(results);
                }
            });
    },
    /*
     * 20170323
     * 不需要参数
     * 返回的是所有省份
     * */
    getProvice:function(cb){
        query('SELECT  provice_id, provice_name FROM provice;',
            function(error,results,fields){
                if(error){
                    console.log("getProvice出错.");
                    console.log(error);
                    cb(0);
                }else{
                    cb(results);
                }
            });
    }
}



