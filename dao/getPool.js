/*
* 20170317
* 获得数据库连接池
* */
var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 20,
    host            : 'localhost',
    user            : 'root',
    password        : '123456',
    database        : 'photo'
});

//导出查询相关
var query=function(sql,param,callback){
    pool.getConnection(function(err,conn){
        if(err){
            callback(err,null,null);
        }else{
            conn.query(sql,param,function(err,vals,fields){
                conn.release();
                //console.log("release--------------------");
                callback(err,vals,fields);
            });
        }
    });
};

module.exports = query;