/*
 * 20170323
 * photo
 * 和photo相关的数据库操作方法
 * */
var query = require('./getPool.js');
module.exports = {
    /*
     * 20170409
     * 删除和照片相关的评论，点赞信息
     * */
    removePhotoMeta:function(photoId,cb){
        query('DELETE FROM COMMENT WHERE photoID=?',
            [photoId],
            function(err,res){
                if(err){
                    console.log('removePhotoMeta 出错！');
                    console.log(err);
                }
                query(
                    'DELETE FROM love WHERE love_Pid = ?;',
                    [photoId],
                    function(err,res){
                        if(err){
                            console.log('removePhotoMeta 出错！');
                            console.log(err);
                        };
                        cb();
                    }
                );
            }
        );
    },
    /*
     * 20170330
     * 取消点赞的路由
     *
     * 没有任何的页面返回。
     * 需要经过 中间件的拦截
     * */
    loveRe:function(userId,photoId,cb){
        query('DELETE FROM love WHERE love_Uid= ? AND love_Pid = ?',
            [userId,photoId],
            function(err,res,fie){
                if(err){
                    console.log('loveRe 出错！');
                }else{
                    console.log('loveRe success！');
                }
            }
        );
    },
     /*
     * 20170330
     * 点赞的路由
     *
     * 点赞完成之后，没有任何的页面返回。
     * */
    loveAdd:function(userId,photoId,cb){
        query('INSERT INTO love(love_Uid,love_Pid,love_Time)VALUES(?,?,?);',
            [userId,photoId,new Date()],
            function(err,res,fie){
                if(err){
                    console.log('loveAdd 出错！');
                }else{
                    console.log('loveAdd success！');
                }
            }
        );
    },
    /*
     * 20170405
     *
     * 传递过来一个照片的ID
     * 然后查询相关的评论
     * */
    getComment:function(id,cb){
        var photoId = id ;
        query('SELECT COMMENT.*,user.* FROM COMMENT JOIN USER ON COMMENT.userid = user.userid AND COMMENT.photoid =?',
            [photoId],
            function(err,res){
                if(err){
                    console.log('getComment 出错！');
                    console.log(err);
                }else{
                    if(res.length>=1){
                        cb(res);
                    }else{
                        cb(0);
                    }
                }
            }
        );
    },
    /*
     * 20170327
     * 跳转到照片的详细页面,
     * 需要传递一个id号过来。还有一个回掉函数
     * 返回值是一个照片实体
     * */
    getPhotoById:function(id,cb){
        var photoId = id ;
        query('SELECT * FROM photo p , USER u WHERE photoId = ? AND p.photoUser = u.userId',
            [photoId],
            function(err,res,fie){
                if(err){
                    console.log('getPhotoById 出错！');
                    console.log(err);
                }else{
                    if(res.length>=1){
                        cb(res);
                    }else{
                        cb(0);
                    }
                }
            }
        );
    },
    /*
     *  20170325
     * 给首页异步加载数据。
     * 并且追加到页面的后面
     * */
    indexAppend:function(page_current,page_colum,cb){
        var page_current=page_current;
        query('SELECT COUNT(0) as page_count_page FROM photo',
            function(err,res,fie){
                //获得总记录数之后，需要与当前页数做比较。
                if(err){
                    console.log("查询总数出错。");
                }else{
                    var page_count_page = res[0].page_count_page;
                    //console.log(page_count_page);
                    //console.log(page_current);
                    //console.log(page_colum);
                    var temp = [(page_current-1)*page_colum,page_colum];
                    if(page_current<=page_count_page){
                        query('SELECT photoId,photoName,photoUser,photoAddress,photoCreatetime,photoUpdatetime,photoIntroduce,phototState,photoNiname,userId FROM photo,user where photo.photoUser = user.userId ORDER BY photoUpdatetime desc LIMIT ?,?',
                            temp,
                            function(error,results,fields){
                                if(error){
                                    console.log("indexAppend  出错.");
                                    console.log(error);
                                    cb(0,0);
                                }else{
                                    //console.log(results[0].userId);
                                    cb(page_count_page,results);
                                }
                            }
                        );
                    }else{
                        cb(0,0);
                    }
                }
            }
        );
    },
    /*
     *  20170324
     *  获取所有的照片.
     *  需要传递当前是第几页   和每页显示的记录数
     * */
    getAllPhoto:function(page_current,page_colum,cb){
        var temp = [(page_current-1)*page_colum,page_colum];
        query('SELECT COUNT(0) as page_count_page FROM photo',
                function(err,res,fie){
                    if(err){
                        console.log("查询总数出错。");
                    }else{
                        query('SELECT photoId,photoName,photoUser,photoAddress,photoCreatetime,photoUpdatetime,photoIntroduce,phototState,photoNiname,userId FROM photo,user where photo.photoUser = user.userId ORDER BY photoUpdatetime desc LIMIT ?,?',
                            temp,
                            function(error,results,fields){
                                if(error){
                                    console.log("getAllPhoto出错.");
                                    console.log(error);
                                    cb(null);
                                }else{
                                    cb(res ,results);
                                }
                            });
                    }
                }
        );
    },
    /*
     *  20170323
     *  编辑照片的路由。
     *  传入一个照片的ID。
     *  最终的查询结果是返回一个照片的对象。
     * */
    editPhotoById:function(data,cb){
        var temp = [data];
        query('SELECT photoId,photoName,photoUser,photoAddress,photoCreatetime,photoUpdatetime,photoIntroduce,phototState,photoNiname FROM photo WHERE photoId = ?;',
            temp,
            function(error,results,fields){
                if(error){
                    console.log("editPhotoById照片出错.");
                    console.log(error);
                    cb(null);
                }else{
                    cb(results);
                }
            });
    },
    /*
     * 20170322
     * 传入一个ID
     * 删除对应的照片
     * */
    removeById:function(data,cb){
        var temp = [data];
        query('DELETE FROM photo WHERE photoId = ?;',
            temp,
            function(error,results){
                if(error){
                    console.log("删除照片出错.");
                    console.log(error);
                    cb(0);
                }else{
                    cb(results.affectedRows);
                }
            });
    },
    /*
     * 20170322
     * 保存photo
     * */
    savePhoto:function(data,cb){
        var temp = [data.photoName,data.photoUser,data.photoAddress,data.photoCreatetime,new Date(),data.photoIntroduce,data.photoNiname];
        query('INSERT INTO photo(photoName,photoUser,photoAddress,photoCreatetime,photoUpdatetime,photoIntroduce, photoNiname)VALUES(?,?,?,?,?,?,?);',
            /*
            *    20170322.
            *    今天在这里掉了很大的一个坑里，这估计是mysql的一个大问题，
            *    调用存储过程的时候就会出现这个问题，明明数据已经成功插入了，但是affectedRows为零。
            *    但是在存储用户信息的时候却是完全没问题的。很诡异的一件事情。
            *    无奈。
            *    只好继续写sql来插入数据了。
            *    下面被注释的这行代码，就是让我找了半早上的问题，但是到现在也没发现问题的原因。
            * */
        //query('CALL insert_photo(?,?,?,?,?);',
            temp,
            function(error,results,fields){
                if(error){
                    console.log("保存照片出错.");
                    console.log(error);
                    cb(0);
                }else{
                    cb(results.affectedRows);
                }
            });
    }
}



