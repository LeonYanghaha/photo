/**
 * 20170323
 * 处理和照片相关的请求。
 * 包括删除一张照片，修改照片的各种信息。
 * 还有各种查询
 */
var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var userServer = require('../server/userServer.js');
var userEntity = require('../entity/user.js');
var checkNotLogin = require('../middlewares/check.js').checkNotLogin;
var checkLogin = require('../middlewares/check.js').checkLogin;
var multer  = require('multer');
//var upload = multer({ storage: storage });
var fs = require('fs');
var getFileName = require('../tool/getFileName');
var photoEntity = require('../entity/photo.js');
var photoServer = require('../server/photoServer.js');
var config = require('config-lite');
var data_page = require('../entity/data');
var format = require('../tool/formatDateTime');
var formatParams = require('../tool/formatParams');



/*
* 20170330
* 取消点赞的路由
*
* 没有任何的页面返回。
* 需要经过 中间件的拦截
* */
router.post(
    '/loveRe',
    checkLogin,
    function(req,res){
        req.on('data',function(data) {
            var data = querystring.parse(data.toString());
            var photoId = data.photoId - 0;
            var userId = req.session.user.userId - 0;
            photoServer.loveRe(userId, photoId, function () {

            });
        });
    }
);
/*
* 20170330
* 点赞的路由
*
* 点赞完成之后，没有任何的页面返回。
* 需要经过 中间件的拦截
* */
router.post(
    '/loveAdd',
    checkLogin,
    function(req,res){
        req.on('data',function(data) {
            var data = querystring.parse(data.toString());
            var photoId = data.photoId - 0;
            var userId = req.session.user.userId - 0;
            photoServer.loveAdd(userId, photoId, function () {

            });
        });
    }
);
/*
 * 20170327
 * 跳转到照片的详细页面
 *
 * 需要登录的中间件的校验
 *
 *
 * 20170405
 * 在查询图片的同时，应该将相关的评论也查出来。
 * */
router.all(
    '/getPhotoById/:pid',
    checkLogin,
    function(req,res){
        var photoId = req.params.pid;
        photoServer.getPhotoById(photoId,function(photo){
            if(!(photo.length>0)){
                res.render('result',{title:'亲。。出错了。。。等会再来试试..',user:req.session.user,page_flag:1,path:config.path});
            }else{
                //需要对上传时间和拍摄时间做格式化处理。
                photo[0].photoCreatetime =format.formatDateTime("yyyy-MM-dd", new  Date( photo[0].photoCreatetime));
                photo[0].photoUpdatetime =format.formatDateTime("yyyy-MM-dd  HH:mm:ss", new  Date( photo[0].photoUpdatetime));
                //查询相关的评论。
                photoServer.getComment(photoId,function(result){
                    for(var i = 0 ; i < result.length; i++){
                        result[i].commentTime = format.formatDateTime("yyyy-MM-dd  HH:mm:ss", new Date(result[i].commentTime));
                    }
                    res.render('photo_meta',{title:photo[0].photoNiname,comment:result,user:req.session.user,page_flag:1,path:config.path,photo:photo[0]});
                });
            }
        });
    }
);
/*
* 20170325
* 首页。异步的加载数据的路由
* */
router.post(
    '/index_append',
    function(req,res){
        req.on('data',function(data){
            var data = querystring.parse(data.toString());
            var page_current = data.page_current-0+1;
            var page_count_page = data.page_count_page;    //这个数据暂时没用。
            var page_colum = config.page_colum; //每次加载的记录条数
            photoServer.indexAppend(page_current,page_colum,function(page_count_page,data){
                var  page_count_page = page_count_page;
                console.log(page_count_page);
                if(0==data){ //表示数据加载出错，或者已经加载到了数据的最后面。
                    res.send(0);
                }else{
                    if(data.length>=0){
                        //赋值给总记录数
                        data_page.page_count_data = page_count_page.page_count_page;
                        //总页数
                        data_page.page_count_page =Math.ceil(page_count_page.page_count_page/page_colum);
                        //当前页数
                        data_page.page_current = page_current;
                        //每页的记录数
                        data_page.page_colum = page_colum;
                        //每页显示的数据
                        data_page.page_data = data;
                        //console.log(data);
                        //console.log(data_page.page_data.length);
                        res.send({data_page:data_page});
                    }else{
                        console.log("--------------------");
                        res.send(0);
                    }
                }
            });
        });
    }
);


/*
 *  20170323
 *  编辑照片的路由。
 *  传入一个照片的ID。
 *  最终的查询结果是返回一个照片的对象。
 * */
router.get(
    '/editPhotoById/:id',
    checkLogin,//检查用户是否登陆，如果没有登陆，则调转到登陆页面
    function(req,res){
        photoServer.editPhotoById( req.params.id,function(result){
            //如果 result.length>=0 ，则跳转到编辑页面，否则提示错误。
            if(result.length>=0){
                res.render('user_publish',{title:'分享我的精彩...',user:req.session.user,page_flag:1,photo:result[0],path:config.path});
            }else{
                res.render('user_publish',{title:'服务器睡着了...删除失败.',user:req.session.user,page_flag:1,path:config.path});
            }
        });
    }
);

/*
*  20170323
* 删除一张照片，需要传递一个照片的ID过来.
* 删除成功之后，需要跳转到用户的主页
* */
router.get(
    '/removeById/:id',
    checkLogin,//检查用户是否登陆，如果没有登陆，则调转到登陆页面
    function(req,res){
        var  params =  req.params.id;
        var paramsArray = formatParams.format(params);
        var photoId = paramsArray[0];
        var photoName = paramsArray[1];
        photoServer.removeById(photoId,function(affectedRows){
            //如果删除成功，就直接跳转到用户的主页上，如果删除失败，则提示用户删除失败。
            if(1==affectedRows){
                /*
                 *  20170409
                 * 成功删除照片之后，
                 * 需要删除评论表，点赞表中与之相关的记录，并且要删掉文件夹中相对应的文件。
                 * */
                fs.unlink("./uploads/"+photoName);
                res.redirect('../../get_useinfo');
                photoServer.removePhotoMeta(photoId,function(){

                });
            }else{
                res.render('result',{title:'服务器睡着了...删除失败.',user:req.session.user,page_flag:1,path:config.path});
            }
        });
    }
);

module.exports = router;
