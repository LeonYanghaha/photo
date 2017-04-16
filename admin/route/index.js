/**
 * Created by Yangk on 2017-04-12.
 * 后台管理页面的路由。
 * 后端管理页面的路由均以 admin 开头
 */
/*
 * 20170323
 * 用以处理异步加载省市县的资源
 * */
var express = require('express');
var otherServer = require('../../server/otherServer.js');
var router = express.Router();
var config = require('config-lite');
var checkLoginIsAdmin = require('../../middlewares/check').checkLoginIsAdmin;
/*
 * 跳转到后台管理页面的主页
 *  20170412
 *
 *  进入这个路由之后，需要先做校验，如果是管理员，并且已经成功登陆，那么就显示后台管理的主页。
 *  如果不满足以上条件的任意一个，则跳转到后台管理页面的登录界面
 * */
router.all(
    '/',
    checkLoginIsAdmin,
    function(req,res){
        console.log("--------------");
        res.render('admin_index');
    }
);

/*
* 20170412
* 跳转到后台的登录页面
* */
router.get(
    '/admin_login',
    function(req,res){
        console.log("admin_login");
        res.render('admin_login');
    }
);

module.exports = router;

