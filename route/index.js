/*
* 20170317
* 路由主文件
* */

var checkNotLogin = require('../middlewares/check.js').checkNotLogin;
var checkLogin = require('../middlewares/check.js').checkLogin;
var userServer = require('../server/userServer');
var format = require('../tool/formatDateTime');
var config = require('config-lite');
var photoServer = require('../server/photoServer');
var data_page = require('../entity/data');

module.exports = function(app){
    /*
     * 20170412
     * 跳转到后台管理页面的路由
     *
     *
     * 20170416
     * 现在建立了专门的sso系统。
     * 所以以下的代码注释了。
     * */
    //app.use('/admin', require('../admin/route/index.js'));
    /*
     * 20170323
     * 处理other
     * */
    app.use('/other', require('./other.js'));
    /*
     * 20170323
     * 处理和照片相关的路由
     * */
    app.use('/photo', require('./photo.js'));

    /*
     * 20170318
     * 处理用户相关的路由
     * */
    app.use('/user', require('./user.js'));
    /*
     * 20170318
     * 跳转到登陆页面
     * */
    app.get('/user_login',function(req,res){
        if(req){
            res.render('user_login',{title:'登陆页面',user:req.session.user,page_flag:1,path:config.path});
        }
    });
    /*
     * 20170318
     * 跳转到注册页面
     * */
    app.get('/user_regist',function(req,res){
        if(req){
            res.render('user_regist',{title:'注册页面',user:req.session.user,page_flag:1,path:config.path});
        }
    });
    /*
    * 20170317
    * 跳转到主页
    * */
    app.get('/',function(req,res){
        if(req){
            /*
            * 20170324  修改
            * 当直接打开首页的时候，应该是将数据展示到页面上的。
            * */
            var page_current = 1;//进入这个路由的，都是首次打开的页面，也就是从第一页开始加载，
            var page_colum = config.page_colum;  //对于首页来说，每次异步请求，加载15条记录。
            photoServer.getAllPhoto(page_current,page_colum,function(count,data){
                if(count.length>=0 && data.length>=0){
                    //console.log(count[0].page_count_page);
                    //赋值给总记录数
                    data_page.page_count_data = count[0].page_count_page;
                    //总页数
                    data_page.page_count_page =Math.ceil(count[0].page_count_page/page_colum);
                    //当前页数
                    data_page.page_current = page_current;
                    //每页的记录数
                    data_page.page_colum = page_colum;
                    //每页显示的数据
                    data_page.page_data = data;
                    //console.log(data_page);
                    res.render('index',{title:'首页',user:req.session.user,page_flag:0,path:config.path,data_page:data_page,next:0});//关于next 表示是否还有数据，0表示有，1表示没有
                }else{
                    res.render('result',{title:'服务器开小差了',user:req.session.user,page_flag:1,path:config.path});
                }
            });
        }
    });
    /*
     * 20170317
     * 跳转到用户关注的页面
     * 如果当前没有用户登录，则直接跳转到登录页面。
     * 如果有用户登录，则直接返回用户关注的其他用户的动态。
     *
     *
     * 20170403
     * 添加了分页的功能。
     * 这个功能现在是实现了，但是存在一个问题：就是在传递参数的时候，并没有分装成一个pageBean的对象去传递，而是仅仅传递了属性。
     * 虽然对于效果是不影响的。但就是不规范，后面抽时间改了。
     * */
    app.get('/get_focus/:page',
        checkLogin,//检查用户是否登陆，如果没有登陆，则调转到登陆页面
        function(req,res){
        if(req){
            var focus_Uid = req.session.user.userId-0 ;
            var currentPagr = req.params.page;
            userServer.get_focus(focus_Uid,currentPagr,function(pageBean){
                var result = pageBean.page_data;
                for(var index = 0 ; index <result.length; index++ ){
                    //处理照片的拍摄时间
                    if(result[index].photoCreatetime  != null || result[index].photoCreatetime  != undefined || result[index].photoCreatetime  != ''){
                        result[index].photoCreatetime = format.formatDateTime("yyyy-MM-dd", new  Date(result[index].photoCreatetime));
                    }
                    //处理照片的上传时间
                    if(result[index].photoUpdatetime  != null || result[index].photoUpdatetime  != undefined || result[index].photoUpdatetime  != ''){
                        result[index].photoUpdatetime = format.formatDateTime("yyyy-MM-dd HH:mm:ss", new Date(result[index].photoUpdatetime));
                    }
                   };
                pageBean.page_data = result;
                res.render('user_focus',{title:'我的关注',user:req.session.user,page_flag:2,path:config.path,data:pageBean});
            });
        }
    });
    app.get('/get_focus',
        checkLogin,//检查用户是否登陆，如果没有登陆，则调转到登陆页面
        function(req,res){
            res.redirect(config.path+'/get_focus/1');
        });
    /*
     * 20170317
     * 跳转到用户信息页面
     * */
    app.get("/get_useinfo/:pageNum",
        checkLogin,//检查用户是否登陆，如果没有登陆，则调转到登陆页面
        function(req,res){
        if(req){
            /*
            *  20170322
            * 获取当前用户的ID，并获取到改用户发表的图片，按照时间排序，并返回到页面上。
            * */
            var userId = req.session.user.userId-0;  //当前用户的id
            data_page.page_current = req.params.pageNum-0;//传递过来的页数
            userServer.getPhotoByUserID(userId,data_page,function(data){
                if(0==data){//没有查到数据的情况
                    data_page.page_count_page = 0;  //总页数
                    data_page.page_count_data = 0;  //总记录数
                    data_page.page_current = 0;//当前页数   其实这个变量也可以不用赋值。
                    data_page.page_data = data;  //每页显示的数据
                    data_page.page_colum = config.page_colum;//每页显示的记录数
                    data = data_page;
                }else{
                    var result = data.page_data; //获取pageBean传递过来的，并取出每页显示的数据，将时间做格式化处理
                    if(result.length>=1){
                        for(var index = 0 ; index <result.length ; index++ ){
                            /*
                             * 20170322
                             * 今晚上写这些代码花了很长的世界，究其原因来说。
                             * 还是自己的不仔细，其实从数据库里查询出来的是一个数组，
                             * 结果自己傻不拉几的就直接取值，肯定是获取不到的。
                             * 但是不知道自己的脑子当时是怎么想的，反正就是很长时间之后才发现了这个问题，
                             * 很是浪费时间。
                             * 太不应该了。
                             * 以后一定要牢牢的记着今天的这种低级错误。
                             * 一定要小心。
                             * */
                            //处理照片的拍摄时间
                            if(result[index].photoCreatetime  != null || result[index].photoCreatetime  != undefined || result[index].photoCreatetime  != ''){
                                result[index].photoCreatetime = format.formatDateTime("yyyy-MM-dd", new  Date(result[index].photoCreatetime));
                            }
                            //处理照片的上传时间
                            if(result[index].photoUpdatetime  != null || result[index].photoUpdatetime  != undefined || result[index].photoUpdatetime  != ''){
                                result[index].photoUpdatetime = format.formatDateTime("yyyy-MM-dd HH:mm:ss", new Date(result[index].photoUpdatetime));
                            }
                        }
                        data.page_data=  result ;
                        //console.log(data);
                    }
                }
                res.render('user_useinfo',{title:'用户主页',user:req.session.user,page_flag:1,photo_data:data,path:config.path});
            });
        }
    });
    /*
     * 20170403
     * 对这个路由做了分页的处理
      * 清明第二天假期。加油！
     * */
    app.get("/get_useinfo",
        checkLogin,//检查用户是否登陆，如果没有登陆，则调转到登陆页面
        function(req,res){
            if(req){
                res.redirect(config.path+'/get_useinfo/1');
              }
        });
    /*
     * 20170321
     * 跳转到 关于本站的页面
     * 单纯的页面跳转。。没有任何中间件。
     * */
    app.get(
        '/about_webStack',
        function(req,res){
            if(req){
                res.render('about_webStack',{title:'关于本站',user:req.session.user,page_flag:1,path:config.path});
            }
        }
    );
    /*
     * 20170321
     * 跳转到 关于作者的页面
     * 没有任何中间件过滤
     * */
    app.get(
        '/about_Author',
        function(req,res){
            if(req) {
                res.render('about_Author', {title: '关于作者', user: req.session.user, page_flag: 1,path:config.path});
            }
        }
    );
    /*
    * 20170405
    * 做个测试的一个路由
    * */
    //app.get(
    //    '/test',
    //    function(req,res){
    //        console.log(req.query.id);
    //        res.send('Nodejs');
    //    }
    //);
    /*
     * 20170409
     * 处理other
     *
     * 20170409
     * 刚刚做了测试的，
     * 由于express是从上到下依次来匹配的。
     * 所以，
     * 将这个路由写在最上面就导致的结果是：该路由接管了所有的路由。
     * 其他的路由无法访问。
     * 所以，必须将这个路由写在最后面。
     * */
    app.use(function (req, res) {
        if (!res.headersSent) {
            res.render('404',{title:'焦点拍客',user:req.session.user,page_flag:1,path:config.path});
        }
    });
}