/**
 * 20170318
 * 用户的server层
 */
var userDao = require('../dao/userDao.js');
module.exports = {
    /*
     * 20170409
     * 修改用户的消息的状态
     * */
    updateMessageState:function(id,cb){
        userDao.updateMessageState(id,cb);
    },
     /*
     * 20170409
     * 获取用户没有读取的消息的数目
     * */
    getMessageNum:function(id,cb){
        userDao.getMessageNum(id,cb);
    },
    /*
     * 20170330
     * 跳转到用户的消息页面。
     * 包括  0 点赞     1 评论       2  关注
     * */
    getMseeage:function(id,cb){
        userDao.getMseeage(id,cb);
    },
    /*
     * 20170329
     * 保存用户的评论
     * */
    publish_comment:function(comment,cb){
        userDao.publish_comment(comment,cb);
    },
    /*
    * 20170328
    * 获得当前用户的关注的其他用户的动态。
    * 需要传入当前用户的ID号
    * */
    get_focus:function(id,currentPagr,cb){
        userDao.get_focus(id,currentPagr,cb);
    },
     /*
    * 20170327
    * 关注其他用户的server层
    * */
    focusAuthor:function(focu_Wid,focus_Uid,cb){
        userDao.focusAuthor(focu_Wid,focus_Uid,cb);
    },
    /*
    * 20170322
    * 通过useID获取该用户发表的照片。
    * */
    getPhotoByUserID:function(userID,data_page,cb){
        userDao.getPhotoByUserID(userID,data_page,cb);
    },
    /*
     * 20170321
     * 用户名的唯一性校验....供用户注册时，处理ajax请求
     * */
    checkUserName:function(data,cb){
        userDao.checkUserName(data,cb);
    },
    /*
     * 20170318
     * 用户登陆
     *
     * 20170416
     * 将下面的代码注释了。
     * 现在搭起了sso
     * */
    //loginUserServer:function(data,cb){
    //    userDao.loginUserDao(data,cb);
    //},
    /*
    * 20170318
    * 处理用户的注册
    * */
    registUserServer:function(data,cb){
        userDao.registUserDao(data,cb);
    }
}

