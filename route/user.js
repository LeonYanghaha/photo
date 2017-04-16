/**
 * 20170318
 * 访问该路由文件的规则是 /user/*
 * 处理和用户相关的路由。比如用户的登陆，注册，修改密码等功能。
 */
var express = require('express');
var router = express.Router();
var querystring = require('querystring');
var userServer = require('../server/userServer.js');
var userEntity = require('../entity/user.js');
var checkLogin = require('../middlewares/check.js').checkLogin;
var multer  = require('multer');
var upload = multer({ storage: storage });
var fs = require('fs');
var getFileName = require('../tool/getFileName');
var photoEntity = require('../entity/photo.js');
var photoServer = require('../server/photoServer.js');
var config = require('config-lite');
var format = require('../tool/formatDateTime');
var stringTrim = require('../tool/stringTrim');
var comment = require('../entity/comment');
var pageBean = require('../entity/data');
var superagent = require('superagent');
var sha1 = require('utility');

/*
* 20170409
* 修改消息的状态
* */
router.post(
    '/updateMessageState',
    checkLogin,
    function(req,res){
        var userId = req.session.user.userId-0 ;//当前用户的ID
        userServer.updateMessageState(userId,function() {
            /*
            * 回掉函数里没有内容
            * */
        });
    }
);
/*
* 20170409
* 获取用户没有读取的消息的数目
* */
router.post(
    '/getMessageNum',
    checkLogin,
    function(req,res){
        req.on('data',function(data){
            var data = querystring.parse(data.toString());
            var userId = data.userId-0;
            //获取session中的id，和传递过来的id做比较，如果一致，则查数据库
            var userIdS = req.session.user.userId-0 ;//当前用户的ID
            if(userId==userIdS){
                userServer.getMessageNum(userIdS,function(Num){
                    //console.log(Num);
                    res.send({Num:Num});
                });
            }else{
                res.send({Num:0});
            }
        });
    }
);

/*
* 20170330
* 跳转到用户的消息页面。
* 经过了中间件的拦截，校验当前是否有用户登录。
* 如果成功登录。则直接去数据库里返回和当前用户相关的消息。
* 包括  0 点赞     1 评论       2  关注
* */
router.get(
    '/user_message',
    checkLogin,
    function(req,res){
        var userId = req.session.user.userId-0 ;//当前用户的ID
        userServer.getMseeage(userId,function(result){
            //对各种时间做格式化
            for(var i = 0 ; i < result.length ; i++){
                if(result[i].message_Time!= null || result[i].message_Time!= undefined || result[i].message_Time!= ''){
                    result[i].message_Time = format.formatDateTime("yyyy-MM-dd HH:mm:ss", new  Date(result[i].message_Time));
                }
                if(result[i].message_C_photoUpdatetime!= null || result[i].message_C_photoUpdatetime!= undefined || result[i].message_C_photoUpdatetime != ''){
                    result[i].message_C_photoUpdatetime = format.formatDateTime("yyyy-MM-dd HH:mm:ss", new Date(result[i].message_C_photoUpdatetime));
                }
            }
            if(result.length>=1){
                res.render('user_message',{title:'与我相关',messageList:result,user:req.session.user,page_flag:1,path:config.path});
                /*
                * 20170409
                * 当成功打开用户的消息页面之后。
                * 就需要将用户的消息状态该为 1 。
                * 标记为已读的状态
                *
                *
                * 20170409
                * 修改消息状态的函数调用。
                * 写在这里不合适。
                * 由于这个路由，调用的次数很多。
                * 写在这里，会严重的拖累性能的。
                * 所以，注释了。重新考虑。
                * */
                //userServer.updateMessageState(userId,function(){
                //            /*
                //            * 回掉函数里没有内容
                //            * */
                //});
            }else{//没有查到消息的情况。
                res.render('user_message',{title:'与我相关',messageList:0,user:req.session.user,page_flag:1,path:config.path});
            }
        });
    }
);
/*
* 20170329
* 用户发表评论的路由。
* 通过此路由，会将评论的 信息保存到comment表中。
*
* 这个路由要经过是否登录的中间件校验。
* 将评论的信息保存到数据库之后，跳转到原来的页面上。这里需要做转发操作。
* */

router.post(
    '/publish_comment',
    checkLogin,
    function(req,res){
        //var photoId =req.params.id-0; //被评论的
        //res.redirect('/photo/getPhotoById/41');
        req.on('data',function(data){
            var data = querystring.parse(data.toString());
            var commentContent = stringTrim.trim(data.comment);  //提交的评论内容
            var photoId = data.photoId-0;//评论的照片的ID
            var photoUser = data.photoUser-0;//被评论照片的用户的ID。。。通过这个ID，将提醒被评论的用户。
            var userId = req.session.user.userId-0 ;//当前用户的ID
            comment.photoID = photoId;
            comment.userID = userId;
            comment.commentContent = commentContent;
            comment.commentTime = new Date();
            comment.commentState = 0;
            comment.commentToUser = photoUser;
            userServer.publish_comment(comment,function(){
                res.redirect('../../../photo/getPhotoById/'+photoId);
            } );
        });
    }
);


/*
* 20170328
* 关注用户的路由。
* 需要经过中间件的校验，如果当前没有用户登录，则直接跳转到登录页面。
* 如果成功登录了，则将关注的数据存到focus表之后。跳转到被关注的用户主页。
* */
router.get(
    '/focusAuthor/:id',
    checkLogin,
    function(req,res){
        var focu_Wid = req.params.id-0;   //这个是被关注的 人的ID。
        var focus_Uid = req.session.user.userId-0 ;  //当前用户的ID号，也就是关注的人的ID，直接从session中取值。
        var temp = '关注成功！以后在个人关注页面就可以看见他发表的精彩照片了';
        if(focu_Wid == focus_Uid){
            temp = '您不能自己关注自己玩啊.';
            res.render('result',{title:temp,user:req.session.user,page_flag:1,path:config.path});
        }else{
            /*
             * 这个方法的作用是：
             * 第一：将关注的信息要存储到focus中。
             * 第二：将被关注的用户的ID传过来，并且要跳转到别关注用户的主页上，这里需要转发。
             *
             *
             *
             * 这个方法该来该去。
             * 最终改成了这个样子。
             * 无论关注是否成功。都跳转到result页面去处理吧
             * 之前的写法放弃了。要不然处理的情况太多了，太麻烦了。
             * */
            userServer.focusAuthor(focu_Wid,focus_Uid,function(result){//关于result的说明，0 出问题了，1表示已经关注过了。。。如果是result对象，则说明关注成功。
                //console.log(result);
                if(result.affectedRows ==1 ){  //这是关注成功的情况。
                    /*
                     * 这里遇上一个难题，如果关注成功了。则应该在页面上出现提示：关注成功。。但是这样的话，没法
                     * 将这些信息传递过去，所以做了以下的处理。
                     * 如果关注成功，则不做转发了，直接在这个方法里查数据并返回到页面上。
                     * */
                    temp = '你已经成功关注了，以后在关注页面就可以看见他的最新照片了';
                }else if(result = 1){
                    temp = '你已经关注了该用户，就别凑热闹了';
                } else{//这些都是关注没成功的情况。比如之前已经关注了的。。或者后端出错了等等的。
                    temp = '服务器出问题了...等会再来试试吧....';
                }
                res.render('result',{title:temp,user:req.session.user,page_flag:1,path:config.path});
                /*
                 * 20170328
                 * 通过上面这个实验可以看出：node的路径是很宽松的。
                 * 这种写法 。。/ 表示的上层路径。所以，为了避免之前的问题，可以写多个 。。/..
                 * */
            });
        }
    }
);

/*
* 20170327
* 查询某一个用户发表的所有图片的路由
* 需要传递过来一个用户id
* */
router.get(
    '/getUserById/:id',
    function(req,res){
        var id = req.params.id;
        var currebtPage = req.query.page;
        pageBean.page_count_page;  //总页数
        pageBean.page_count_data;  //总记录数
        pageBean.page_current = currebtPage;//当前页数
        pageBean.page_data;  //每页显示的数据
        pageBean.page_colum = config.page_colum;//每页显示的记录数
        userServer.getPhotoByUserID(id,pageBean,function(result){
            for(var index = 0 ; index <result.length ; index++ ){
                //处理照片的拍摄时间
                if(result[index].photoCreatetime  != null || result[index].photoCreatetime  != undefined || result[index].photoCreatetime  != ''){
                    result[index].photoCreatetime = format.formatDateTime("yyyy-MM-dd", new  Date(result[index].photoCreatetime));
                }
                //处理照片的上传时间
                if(result[index].photoUpdatetime  != null || result[index].photoUpdatetime  != undefined || result[index].photoUpdatetime  != ''){
                    result[index].photoUpdatetime = format.formatDateTime("yyyy-MM-dd HH:mm:ss", new Date(result[index].photoUpdatetime));
                }
            }
            res.render('user_photo',{title:'主页',user:req.session.user,page_flag:1,photo_data:result,path:config.path});
        });
    }
);
router.get(
    '/getUserById/:id',
    function(req,res){
        var id = req.params.id;
        res.redirect(config.path+'/getUserById/'+id+'/1');
    }
);
/**
 * 20170321
 * 处理用户上传图片的路由
 */
router.post(
    '/user_publish',
    checkLogin,//检查用户是否登陆，如果没有登陆，则调转到登陆页面
    upload.single('_id'),
    function (req, res, next) {
        var file_old_name = req.file.originalname;//上传时的源文件的名字
        var file_suffix = file_old_name.substring(file_old_name.lastIndexOf("."),file_old_name.length);//文件的后缀名
        var fileName = getFileName.getFileName()+file_suffix;//保存至数据库时，存放的名字
        fs.writeFileSync('./uploads/'+fileName,req.file.buffer);
        var photo = new photoEntity();
        photo.photoName = fileName;
        photo.photoNiname = req.body.photoNiname;
        photo.photoUser =  req.session.user.userId;
        photo.photoAddress = req.body.photoAddress;
        photo.photoCreatetime = req.body.photoCreatetime;
        photo.photoIntroduce = req.body.photoIntroduce;
        photoServer.savePhoto(photo,function(result){
            if(1==result){
                res.render('result',{title:'保存成功.',user:req.session.user,page_flag:1,path:config.path});
            }else{
                res.render('user_publish',{title:'失败了...再来一次吧.',user:req.session.user,page_flag:1,path:config.path});
            }
        });
});

/*
* 20170327
* 最近太忙了，，公司里的事情多了好多。然后驾校也开始了。
* 哎。。。。继续每天抽点时间敲代码吧
* 要逼逼自己了。
*
*
* 以下路由，仅仅是简单的页面跳转。有一个中间件要检查用户是否登录。
* */
router.get(
    '/user_data',
    checkLogin,
    function(req,res){
        res.render('user_data',{title:'我的资料页.',user:req.session.user,page_flag:1,path:config.path});
    }
);

/*
 *  20170322
 * 处理文件上传的一个方法。
 * 关于这两个方法，按照说明文档是可以定制上传文件的文件名和文件的保存路径的。
 * 但是救我自己的实际结果来说：我没有发现这两个方法的用处。
 * 但是现在也不能删除，否则会报错。
 *
 * 对于上传文件的这个功能来说，我现在的处理方法是：使用diskStorage，将文件的内容封装到了req.file.buffer中、
 * 所以，通过node自带的文件操作函数保存，并且设置其文件名，已经文件大小，文件类型的校验。
 * */
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname+'/tmp/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now()+'.doc')
    }
});


/*
* 20170321
* 用户名的唯一性校验....供用户注册时，处理ajax请求
* */
router.post(
    '/checkUserName',
    function(req,res){
        req.on('data',function(data){
            var data = querystring.parse(data.toString());
            userServer.checkUserName(data,function(result){
                var temp = result.length;
                //0表示可以使用，1表示不能使用。
                res.send({state:temp==1?1:0});
            });
        });
    }
);
/*
* 20170319
* 用户退出登陆的路由
* */
router.get(
    '/user_logout',
    function(req,res){
        delete req.session.user;
        res.redirect('../');
    }
);
/*
* 20170321
* 处理用户发表文章的请求。跳转到发表的页面。需要经过中间件的拦截。如果没有登录，则跳转到登录的页面
* */
router.get(
    '/user_publish',
    checkLogin,//检查用户是否登陆，如果没有登陆，则调转到登陆页面
    function(req,res,next){
        res.render('user_publish',{title:'分享我的精彩...',user:req.session.user,page_flag:1,path:config.path});
    }
);

/*
 * 20170318
 * 用户登陆
 * */
router.post(
    '/login',//checkNotLogin,
    function(req,res,next){
        req.on('data',function(data){
            var data = querystring.parse(data.toString());
            var username = data.userName;
            var password = sha1.md5(data.userPassword);
            superagent.get(config.sso_url+"?username="+username+"&password="+password)
                .end(function(err,result){
                    if(err){//登陆出错
                        console.log("哎吆。。出错了。。。。。。");
                        res.render('result',{title:'--------。登陆失败',user:req.session.user,page_flag:1,path:config.path});
                    }else{
                        var result = JSON.parse(result.text);
                        var logint_state  = result.logint_state-0;
                        if(0==logint_state){//登陆失败
                            res.render('result',{title:'--------。登陆失败',user:req.session.user,page_flag:1,path:config.path});
                        }else{
                            var user = new userEntity();
                           user.userName = result.userName;
                           user.userAddress = result.userAddress;
                           user.userEmail = result.userEmail;
                           user.userHead = result.userHead;
                           user.userId = result.userId;
                           user.userIntroduce = result.userIntroduce;
                           user.userSex = result.userSex;
                           user.userState = result.userState;
                           user.userType = result.userType;
                           user.userBack =  result.userBack;
                            req.session.user = user;
                            //console.log(user);
                            res.render('result',{title:'登陆成功。。。。。。。。',user:req.session.user,page_flag:1,path:config.path});
                        }
                    }
                });
            /*
            * 20170416
            * 搭建起了sso .
            * 有了专门用于处理登陆的系统。
            * 所以以下的代码被注释。
            * */
            //userServer.loginUserServer(data,function(results){
            //   if(results.length>=1){
            //       //将数据库中获取到的信息赋值给新创建的user，并将该user存储到session中
            //       var user = new userEntity();
            //       user.userName = results[0].userName;
            //       user.userAddress = results[0].userAddress;
            //       user.userEmail = results[0].userEmail;
            //       user.userHead = results[0].userHead;
            //       user.userId = results[0].userId;
            //       user.userIntroduce = results[0].userIntroduce;
            //       user.userSex = results[0].userSex;
            //       user.userState = results[0].userState;
            //       user.userType = results[0].userType;
            //       user.userBack =  results[0].userBack;
            //       req.session.user = user;
            //       //以上是登陆成功的情况。接下来，需要将用户未读的消息获取
            //       res.render('result',{title:'登陆成功。。。。。。。。',user:req.session.user,page_flag:1,path:config.path});
            //   }else{
            //       res.render('result',{title:'--------。登陆失败',user:req.session.user,page_flag:1,path:config.path});
            //   }
            //});
        });
    }
);

/*
* 20170318
* 处理用户的注册
* */
router.post(
    '/regist',
    function(req,res){
       req.on('data',function(data){
           var data = querystring.parse(data.toString());
           var formatAddress = function(str){
               return str.substring(str.lastIndexOf("-")+1,str.length);
           };
            //校验用户的注册信息
           var userName = data.userName;
           var userPassword = data.userPassword;
           var reuserPassword = data.reuserPassword;
           var userEmail = data.userEmail;
           var userSex = data.userSex;
           //var userAddress = data.userAddress;
           var userAddress = formatAddress(data.userAddress_provice)+"-"+formatAddress(data.userAddress_city)+"-"+formatAddress(data.userAddress_area);
           //既然对地址做了修改，那么就应该将这个信息保存至data中，这些信息仅供校验使用。是数据的副本。
           data.userAddress = userAddress;
           var userIntroduce = data.userIntroduce;
           try {
               if (!(userName.length >= 5 && userName.length <= 15)) {
                   throw new Error('名字请限制在 1-15 个字符');
               }
               if (!(userIntroduce.length >= 1 && userIntroduce.length <= 300)) {
                   throw new Error('个人简介请限制在 1-300 个字符');
               }
               if (userPassword < 6) {
                   throw new Error('密码至少 6 个字符');
               }
               if (userPassword !== reuserPassword) {
                   throw new Error('两次输入密码不一致');
               }
           } catch (e) {
               req.flash('error', e.message);
               //return res.redirect('../user_regist');
               res.render('result',{title:req.flash('error'),user:req.session.user,page_flag:1,path:config.path});
           };
           userServer.registUserServer(data,function(affectedRows){
               if(1==affectedRows){
                   res.render('result',{title:'注册成功',user:req.session.user,page_flag:1,path:config.path});
               }else{
                   res.render('result',{title:'ERROR...注册失败',user:req.session.user,page_flag:1,path:config.path});
               }
           });
        });
    }
);

module.exports = router;
