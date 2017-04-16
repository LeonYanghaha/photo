/**
 *2017/3/19.
 */


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
            return res.redirect('../../user_login');
        }
        next();
    },

    checkNotLogin: function checkNotLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '已登录');
            return res.redirect('back');//返回之前的页面
        }
        next();
    }
};
