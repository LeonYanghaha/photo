/*
* 20170317
* 整个程序的入口
* */


var express = require('express');
var ejs = require('ejs');
var config = require('config-lite');
var route = require('./route/index.js');
var path = require('path');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
//var MongoStore = require('connect-mongo')(session);
//引入上传文件的依赖库，这些库是第一次使用，要注意多看帮助文档
/*var multer  = require('multer')
var upload = multer({ dest: '../uploads' })*/

var app = express();

app.use(function(req, res, next){
    res.locals.session = req.session;
    next();
});

//设置cookie
app.use(cookieParser());

// 设置静态文件目录
app.use(express.static('style'));
app.use(express.static('head'));
app.use(express.static('uploads'));
app.use(express.static('images'));

// session 中间件
app.use(session({
    name: config.session.key,// 设置 cookie 中保存 session id 的字段名称
    secret: config.session.secret,// 通过设置 secret 来计算 hash 值并放在 cookie 中，使产生的 signedCookie 防篡改
    cookie: {
        maxAge: config.session.maxAge// 过期时间，过期后 cookie 中的 session id 自动删除
    }//,
    //store: new MongoStore({// 将 session 存储到 mongodb
    //    url: config.mongodb// mongodb 地址
    //})
}));

//设置模版引擎
app.set('view engine','ejs');
//前台页面的views
/*
* 下面这个写法，设置多个views是自己尝试的，到目前没发现问题
* */
app.set('views',[__dirname+"/view",__dirname+"/admin/view"]);
//后台管理页面
//app.set('views',__dirname+"/admin/view");

//使用flash中间件
app.use(flash());

route(app);

app.listen(
    config.host_port,
    config.host_url
);


