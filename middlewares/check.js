/**
 *2017/3/19.
 */
var superagent = require('superagent');

module.exports = {
    /*
    * 检查是否登陆，并且检查是否是管理员。
    * 如果不满足，退回到后台的管理页面的登陆
    * */
    checkLoginIsAdmin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            return res.redirect('../../admin/admin_login');
        };
        if(!(req.session.user.userType>=11)){
            return res.redirect('../../admin/admin_login');
        }
        next();
    },
    /*
    * 检查是否登陆
    * */
    checkLogin: function checkLogin(req, res, next) {
        if (!req.session.user) {
            var cookuserMd5 = req.cookies.userMd5;
            try{
                if(cookuserMd5.length!=32){
                    cookuserMd5 = '0';
                }
            }catch (e) {
                cookuserMd5 = '0';
            };
            var promise = new Promise(function(resolve, reject){
                superagent.get(config.sso_getsession+'/'+cookuserMd5)
                    .end(function(err,result){
                        if(err){//登陆出错
                            reject(0);
                        }else{
                            var result = JSON.parse(result.text);
                            var logint_state  = result.logint_state-0;
                            if(1==logint_state){
                                user = JSON.parse(result.user);
                                req.session.user = user;

                                resolve(1);
                            }else{//登陆失败
                                resolve(0);
                            }
                        }
                    });
            });
        promise.then(function(value) {
            if(1==value){
               // res.render('result',{title:'登录成功',user:req.session.user,userMd5:sha1.md5(req.session.user.userName)});
                next();
            }else{
                return res.redirect('../../user_login');
            }
        }, function(value) {
            console.log("error");
            return res.redirect('../../user_login');
        });
    }
    },

    checkNotLogin: function checkNotLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '已登录');
            return res.redirect('back');//返回之前的页面
        }
        next();
    }
};
