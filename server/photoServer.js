/**
 * 20170322
 * photo的server层
 */
var photoDao = require('../dao/photoDao.js');
module.exports = {

    /*
     * 20170409
     * 删除和照片相关的评论，点赞信息
     * */
    removePhotoMeta:function(id,cb){
        photoDao.removePhotoMeta(id,cb);
    },
    /*
     * 20170330
     * 取消点赞的路由
     *
     * 没有任何的页面返回。
     * 需要经过 中间件的拦截
     * */
    loveRe:function(userId,photoId,cb){
        photoDao.loveRe(userId,photoId,cb);
    },
    /*
     * 20170330
     * 点赞的路由
     *
     * 点赞完成之后，没有任何的页面返回。
     * */
    loveAdd:function(userId,photoId,cb){
        photoDao.loveAdd(userId,photoId,cb);
    },
    /*
     * 20170405
     *
     * 传递过来一个照片的ID
     * 然后查询相关的评论
     * */
    getComment:function(id,cb){
        photoDao.getComment(id,cb);
    },
     /*
     * 20170327
     * 跳转到照片的详细页面,
     * x需要传递一个id号过来。还有一个回掉函数
     * 返回值是一个照片实体
     * */
    getPhotoById:function(id,cb){
        photoDao.getPhotoById(id,cb);
    },
    /*
     *  20170325
     * 给首页异步加载数据。
     * 并且追加到页面的后面
     * */
    indexAppend:function(page_current,page_colum,cb) {
        photoDao.indexAppend(page_current, page_colum,cb);
    },
    /*
     *  20170324
     *  获取所有的照片.
     *  需要传递当前是第几页   和每页显示的记录数
     * */
    getAllPhoto:function(page_current,page_colum,cb) {
        photoDao.getAllPhoto(page_current,page_colum, cb);
    },
    /*
     *  20170323
     *  传入一个照片的ID。
     * */
    editPhotoById:function(data,cb) {
        photoDao.editPhotoById(data, cb);
    },
    /*
     * 20170322
     * 传入一个ID
     * 删除对应的照片
     * */
    removeById:function(data,cb) {
        photoDao.removeById(data, cb);
    },
    /*
     * 20170322
     * 保存用户上传的照片server层
     * */
    savePhoto:function(data,cb) {
        photoDao.savePhoto(data, cb);
    }
}

