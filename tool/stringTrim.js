/*
 * 20170329
 *
 * 传入一个字符串，负责去掉字符串中前后空格
 * 本来以为JavaScript本身有这个方法的，结果刚才查了一下，好像JavaScript没有这个方法。
 * 就需要自己写一个工具类来实现这个功能了。
 * */

module.exports = {
    trim:function(str) {
        return str.replace(/(^\s+)|(\s+$)/g,'');
    }
};

