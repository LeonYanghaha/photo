/*
* 20170323
* 用以处理异步加载省市县的资源
* */
var express = require('express');
var otherServer = require('../server/otherServer.js')
var router = express.Router();
var config = require('config-lite');
/*
 *  20170323
 *  加载县
 * */
router.get(
    '/getarea/:id',
    function(req,res){
        var id = req.params.id;
        otherServer.getArea(id, function(result){
            if(1==result.length>=1) {
                //需要将result转换成html
                var html = "";
                for (var i = 0; i < result.length; i++) {
                    html += '<option class="areaList" value="' + result[i].area_name + '%' + result[i].area_id + '">' + result[i].area_name + '</option>';
                };
                res.send(html);
            }else{
                res.send('');
            }
        });
    }
);
/*
 *  20170323
 *  加载市
 * */
router.get(
    '/getCity/:id',
    function(req,res){
        var id = req.params.id;
        otherServer.getCity(id, function(result){
            if(1==result.length>=1) {
                //需要将result转换成html
                var html = "";
                for (var i = 0; i < result.length; i++) {
                    html += '<option class="cityList" value="' + result[i].city_name + '%' + result[i].city_id + '">' + result[i].city_name + '</option>';
                };
                res.send(html);
            }else{
                res.send('');
            }
        });
    }
);
/*
 *  20170323
 *  加载省的名字
 * */
router.get(
    '/getProvice',
    function(req,res){
        otherServer.getProvice( function(result){
            if(1==result.length>=1) {
                //需要将result转换成html
                var html = "";
                for (var i = 0; i < result.length; i++) {
                    html += '<option value="' + result[i].provice_name + '%' + result[i].provice_id + '">' + result[i].provice_name + '</option>';
                };
                res.send(html);
            } else{
                res.send('');
            }
        });
    }
);
module.exports = router;
