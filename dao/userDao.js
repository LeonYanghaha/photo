/*
* 20170318
* 和用户相关的数据库操作方法
* */
var query = require('./getPool.js');
var uerEntity = require('../entity/user.js');
var sha1 = require('utility');
var pageBean = require('../entity/data');
var config = require('config-lite');

module.exports = {
    /*
     * 20170409
     * 修改用户的消息的状态
     * */
    updateMessageState:function(id,cb){
        query(
            'UPDATE focus SET focu_State = 1 WHERE focus_Wid = ?',
            [id],
            function(err){
                if(err){
                    console.log("1.updateMessageState:"+err);
                }
                query(
                    'UPDATE love SET love_State =1 WHERE love_Pid IN (SELECT photoId FROM photo WHERE photoUser = ?)',
                    [id],
                    function(err){
                        if(err){
                            console.log("2.updateMessageState:"+err);
                        }
                        query(
                            'UPDATE COMMENT SET commentState = 1 WHERE commentToUser = ?',
                            [id],
                            function(err){
                                if(err){
                                    console.log("3.updateMessageState:"+err);
                                }
                                cb();
                            }
                        );
                    }
                );
            }
        );
    },
    /*
     * 20170330
     * 获取用户没有读取的消息的数目
     * */
    getMessageNum:function(id,cb){
        query(
            '(SELECT COUNT(0) num FROM message_0 WHERE message_toId = ? AND message_State = 0)UNION ALL (SELECT COUNT(0) num FROM message_1 WHERE message_toId = ? AND message_State = 0)UNION ALL (SELECT COUNT(0) num FROM message_2 WHERE message_toId =? AND message_State = 0)',
            [id,id,id],
            function(err,resule){
                if(err){
                    console.log("getMessageNum===== 出错");
                    console.log(err);
                    cb(0);
                }else{
                   var temp = 0 ;
                    if(resule.length>=1){
                        for(var i = 0 ; i < resule.length ; i ++){
                            temp+=(resule[i].num-0);
                        }
                        cb(temp);
                    }else{
                        cb(0);
                    }
                }
            }
        );
    },
    /*
     * 20170330
     * 跳转到用户的消息页面。
     * 包括  0 点赞     1 评论       2  关注
     * */
    getMseeage:function(id,cb){
        query(
            'SELECT * FROM((SELECT * FROM message_0) UNION ALL (SELECT * FROM message_1) UNION ALL (SELECT * FROM message_2)) message WHERE message.message_toId = ? ORDER BY message_Time DESC ',
            [id],
            function(err,resule,fields){
                if(err){
                    console.log("getMseeage===== 出错");
                    console.log(err);
                    cb(0);
                }else{
                    cb(resule);
                }
            }
        );
    },
    /*
     * 20170329
     * 保存用户的评论
     * */
    publish_comment:function(comment,cb){
        query(
            'INSERT INTO COMMENT(photoID,userID,commentContent,commentTime,commentState,commentToUser) VALUES(?,?,?,?,?,?)',
            [comment.photoID,comment.userID,comment.commentContent,comment.commentTime,comment.commentState,comment.commentToUser],
            function(err,resule,fields){
                if(err){
                    console.log("publish_comment===== 出错");
                    console.log(err);
                    cb(0);
                }else{
                    cb(resule);
                }
            }
        );
    },
     /*
     * 20170328
     * 获得当前用户的关注的其他用户的动态。
     * 需要传入当前用户的ID号
     * */
    get_focus:function(id,currentPagr,cb){
        query(
            'SELECT COUNT(0) as count FROM photo,USER WHERE photo.photoUser IN(SELECT focus.focus_Wid FROM focus WHERE focus.focus_Uid = ?) AND user.userId = photo.photoUser',
            [id],
            function(err,count){
                if(err){
                    console.log("get_focus  出错");
                    console.log(err);
                    cb(0);
                }else{
                    query(
                        'SELECT photo.* , user.* FROM photo ,USER WHERE photo.photoUser IN (SELECT focus.focus_Wid FROM focus WHERE focus.focus_Uid = ?) AND user.userId = photo.photoUser ORDER BY photo.photoUpdatetime DESC limit ?,?',
                        [id,(currentPagr-0-1)*config.page_colum,config.page_colum ],
                        function(err,resule,fields){
                            if(err){
                                console.log("get_focus  出错");
                                console.log(err);
                                cb(0);
                            }else{
                                pageBean.page_count_page=Math.ceil((count[0].count-0)/config.page_colum);  //总页数
                                pageBean.page_count_data=count[0].count;  //总记录数
                                pageBean.page_current=currentPagr;//当前页数
                                pageBean.page_data=resule;  //每页显示的数据
                                pageBean.page_colum=config.page_colum;//每页显示的记录数
                                cb(pageBean);
                            }
                        }
                    );
                }
            }
        );
    },
    /*
     * 20170328
     * 关注其他用户的dao层
     * */
    focusAuthor:function(focu_Wid,focus_Uid,cb){
        /*
        * 20170405
        * 原来的联合主键出问题了。
        * 现在导致的结果就是：关注的这个功能需要改进。
        * 之前由于对联合主键的理解不透彻。所以埋下这个坑。
        * 现在要记着了。在mysql中，如果设置了联合主键，那么 1， 2  和2,1 是一样的，都会认为是从重复的。
        *
        * 现在需要做的就是，在关注的时候，插入数据之前，先检查，之前是否已经关注了。所以在插入之前，有一个查询的动作。
        * */
        query(
            'SELECT focus_Uid,focus_Wid FROM focus WHERE focus_Uid = ? AND focus_Wid = ?',
            [focus_Uid,focu_Wid],
            function(err,resule){
                if(err) {
                    console.log("focusAuthor  出错");
                    console.log(err);
                    cb(0);
                }else{
                    if(resule.length>=1){
                        //这里是已经有数据的情况
                        cb(1);
                    }else{
                        //没有关注，则插入数据。并返回状态
                        query(
                            'INSERT INTO focus (focus_Uid,focus_Wid,focus_Time,focu_State) VALUES(?,?,?,?)',
                            [focus_Uid,focu_Wid,new Date(),0],
                            function(err,resule,fields){
                                if(err){
                                    console.log("focusAuthor  出错");
                                    console.log(err);
                                    /*
                                     * 20170328
                                     * 将这个很可能报错的代码注释了。
                                     * 由于focus表采用的是联合主键，再加上目前就三四个用户，互相关注，很容易造成重复的。
                                     * 所以先注释了吧。
                                     * 然后往回调函数里传入一个0 ，  代表出错了。
                                     * */
                                    cb(0);
                                }else{
                                    cb(resule);
                                }
                            }
                        );
                    }
                }
            }
        );
    },
    /*
     * 20170322
     * 通过useID获取该用户发表的照片。
     * */
    getPhotoByUserID:function(userid,data_page,cb){
        //每页显示的记录条目数
        var page_colum = config.page_colum;
        query(
            'SELECT (SELECT COUNT(0) FROM photo WHERE photoUser =?) as count,photoId,photoName,photoUser,photoAddress,photoCreatetime,photoUpdatetime,photoIntroduce,phototState,photoNiname FROM photo WHERE photoUser =? ORDER BY photoUpdatetime DESC LIMIT ?,?',
            [userid,userid,(data_page.page_current-0-1)*page_colum,page_colum],
            function(err,resule){
                if(err){
                    console.log("通过用户ID查询用户发表的照片出错！");
                    console.log(err);
                    cb(0);
                }else{
                    if(resule.length>=1){
                        //取到总记录数
                        var count = resule[0].count;
                        //console.log(count);
                        //console.log("---------------");
                        //console.log(page_colum);
                        /*
                        * 20170403
                        * 这里有个坑，以后要小心。
                        * 在sql语句中，是不区分大小写的。
                        * 但是在nodejs中，是区分大小写的。
                        * 所以就导致这个问题。
                        * 在sql中，写成 ***COUNT**
                        * 然后在获取的时候 resule[0].count   这种写法是获取不到的。
                        * 以后要小心。
                        * */
                        //拼凑pageBean
                        pageBean.page_count_page = Math.ceil((count-0)/(page_colum-0));  //总页数
                        pageBean.page_count_data = count;  //总记录数
                        pageBean.page_current = data_page.page_current;//当前页数   其实这个变量也可以不用赋值。
                        pageBean.page_data = resule;  //每页显示的数据
                        pageBean.page_colum = config.page_colum;//每页显示的记录数
                        cb(pageBean);
                    }else{

                        cb(0);
                    }
                }
            }
        );
    },
    /*
     * 20170321
     * 用户名的唯一性校验....供用户注册时，处理ajax请求
     * */
    checkUserName:function(data,cb){
        query('SELECT userid FROM USER WHERE userName = ?',
            [data.userName],
            function(err,resule,fields){
                if(err){
                    console.log("用户名唯一性校验出错！");
                    console.log(err);
                }else{
                    cb(resule);
                }
            }
        )
    },
    /*
     * 20170318
     * 用户登陆
     *
     * 20170416
     * 将下面的代码注释了。
     * 现在搭起了sso
     * */
    //loginUserDao:function(data,cb){
    //    query('SELECT userId,userName,userPassword,userEmail,userSex,userAddress,userIntroduce,userState,userHead,userType,userBack FROM USER WHERE userName = ? AND userPassword =?',
    //        [data.userName,sha1.md5(data.userPassword)],
    //        function(error,results, fields){
    //            if(error){
    //                console.log("用户登陆出错！");
    //                console.log(error);
    //            }else{
    //                cb(results);
    //            }
    //        });
    //},
    /*
    * 20170318
    * 保存用户的信息
    * */
    registUserDao:function(data,cb){
        var user = [data.userName,sha1.md5(data.userPassword), data.userEmail,data.userSex,data.userAddress,data.userIntroduce,data.userSex==0?'0.jpg':'1.jpg'];
        query('CALL insert_user(?,?,?,?,?,?,?)',
            user,
            function(error,results){
                //console.log(results);
            if(error){
                console.log("用户注册信息保存出错");
                console.log(error);
                cb(0);  //如果保存出错，还是需要继续调用回调函数，给页面一个相应的，要不然就出现了刚才这个问题。--20170321
            }else{
                cb(results.affectedRows);
            }
        });
    }
};