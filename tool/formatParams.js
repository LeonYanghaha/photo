/*
* 20170409
* 在删除照片的时候，传递过来两个参数。
* 并且以id*name的形式拼接起来的。
* 通过这个函数，就可以分别拆出来这两个参数
*
* 如果在截取的时候发生异常，
* 则返回0；
* */

module.exports = {
    format:  function(params){
        try{
            var index = (params+"").indexOf("*");
            var photoId = params.substring(0,index);
            var photoName = params.substring(index+1,params.length);
            return [photoId,photoName];
        }catch(e){
            return 0;
        }

    }
};