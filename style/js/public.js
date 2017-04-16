/*
* 20170318
* 页面头部的公共的JavaScript
* */

/*
 * 20170405
 * 本地预览图片
 * */
var previewFile = function () {
    var preview = document.querySelector('.publish_img_preview');
    //console.log(typeof preview);
    //console.log(preview);
    var file  = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();
    console.log(file);
    //console.log(reader);
    reader.onloadend = function () {
        preview.src = reader.result;
    }
    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src = "";
    }
};

$(function(){
    /*
    * 20170328
    * 今晚上一边听国足在伊朗的比赛。
    * 一边写代码。
    *
    * 点击首页的了解拍客的函数。
    * */
    $('.head_btn_underStrand').click(function(){
        $(document.body).css({ //禁止页面
            "overflow-x":"hidden",
            "overflow-y":"hidden"
        });
        $('.head_underStand_main_div').show();
    });

    $('.head_underStand_close_logo').click(function(){
        $(document.body).css({//启用页面滚动
            "overflow-x":"auto",
            "overflow-y":"auto"
        });
        $('.head_underStand_main_div').hide();
    });

    /*
     * 20170321
     * 邮箱地址的校验
     * 这个校验比较简单，
     * 符合正则表达式就ok。
     * */
    $('.userEmail').focus(function(){
        $('.userEmail_span').html("输入你的邮箱地址，以方便之后找回密码.");
    });
    $('.userEmail').change(function(){
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        var temp = $(this).val().trim();
        if(reg.test(temp)){ //如果符合正则表达式
            $('.userEmail_span').html("<span style='color: green'>ok.</span>");
        }else{
            $('.userEmail_span').html("<span style='color: red'>请输入合法的邮箱地址..</span>");
        }
    });
    /*
     * 20170321
     * 确认密码的校验。
     * 和第一次输入密码的规则一样。
     * 需要和第一次输入的密码保持一致。
     * */
    $('.reuserPassword').focus(function(){
        $('.reuserPassword_span').html("务必确保两次输入的密码一致.");
    });
    $('.reuserPassword').change(function(){
        var temp = $(this).val().trim();   //确认密码
        var password = $('.userPassword').val().trim();  //第一次输入密码的值
        if(''==temp || ''==password){
            $('.userPassword_span').html("<span style='color: red'>密码不能为空.</span>");
            $('.reuserPassword_span').html("<span style='color: red'>密码不能为空.</span>");
            return false ;
        }else if(5>=temp.length || 15<=temp.length){
                $('.userPassword_span').html("<span style='color: red'>密码的长度需要大于5,小于15.</span>");
                $('.reuserPassword_span').html("<span style='color: red'>密码的长度需要大于5,小于15.</span>");
                return false ;
        }else if(temp == password){
            $('.userPassword_span').html("<span style='color: green'>ok.</span>");
            $('.reuserPassword_span').html("<span style='color: green'>ok.</span>");
            return false ;
        }else if(''==password){
            $('.reuserPassword_span').html("<span style='color: red'>请输入密码.</span>");
            return false ;
        }else{
            $('.reuserPassword_span').html("<span style='color: red'>两次输入的密码不一致.</span>");
            $('.userPassword_span').html("<span style='color: red'>两次输入的密码不一致.</span>");
            return false ;
        }
    });
    /*
    * 20170321
    * 密码的校验。
    * 密码的校验规则是：
    * 长度为5=<  X =<15
    * */
    $('.userPassword').focus(function(){
        $('.userPassword_span').html("密码的长度需要大于5,小于15.");
    });
    $('.userPassword').change(function(){
        var temp = $(this).val().trim();   //第一次输入的密码值
        var retemp = $('.reuserPassword').val().trim();  //第二次输入密码的值
        if(''==temp){ //用户名的非空校验
            $('.userPassword_span').html("<span style='color: red'>密码不能为空.</span>");
            return false ;
        }else  if(5>=temp.length || 15<=temp.length){  //用户名的长度校验
            $('.userPassword_span').html("<span style='color: red'>密码的长度需要大于5,小于15.</span>");
            return false ;
        }else if(''==retemp){
            $('.userPassword_span').html("<span>请输入确认密码.</span>");
            return false ;
        }else if(temp==retemp){
            $('.userPassword_span').html("<span style='color: green'>ok.</span>");
            $('.reuserPassword_span').html("<span style='color: green'>ok.</span>");
            return false ;
        }else{
            $('.userPassword_span').html("<span style='color: red'>密码输入不一致，请重新输入..</span>");
            $('.reuserPassword_span').html("<span style='color: red'>密码输入不一致，请重新输入..</span>");
            return false ;
        }
    });
    /*
    * 20170321
    * 用户名输入时的校验，用户名的校验规则是长度为5=<  X =<15,并且唯一
    * */
    $('.userName').focus(function(){
        $('.userName_span').html("用户名的长度需要大于5,小于15.");
    });
    $('.userName').change(function(){
        var temp = $(this).val().trim();
        if(''==temp){ //用户名的非空校验
            $('.userName_span').html("<span style='color: red'>用户名不能为空.</span>");
            return false ;
        }else  if(5>=temp.length || 15<=temp.length){  //用户名的长度校验
           $('.userName_span').html("<span style='color: red'>用户名的长度需要大于5,小于15.</span>");
           return false ;
       }
        $.post( //用户名的唯一性校验
            '../user/checkUserName',
            {userName: $(this).val().trim()},
            function(temp){
                if(1==temp.state){
                    $('.userName_span').html("<span style='color: red'>改用户名已经被注册.</span>");
                    return false ;
                }else{
                    $('.userName_span').html("<span style='color: green'>ok.</span>");
                    return false ;
                }
            }
        );
    });
    /*
    * 20170320
    * 点击首页的加入拍客。跳转到注册页面的函数
    * */
    $('.head_btn_joinPaike').click(function(){
       // alert("head_btn_joinPaike");
        location.href = "../user_regist";
    });
    /*
    * 20170406
    * 返回顶部的方法
    * */
    $('.topTop_img').hover(
        function(){ //移入
            $(this).attr('src','../../img/top_2.png');
            $('.topTop_span').hide();
        },
        function(){//移出
            $(this).attr('src','../../img/top_1.png');
            $('.topTop_span').show();
        }
    ).click(function(){
            $( window ).scrollTop(0);
        });
    //监听鼠标的滚动
    window.onscroll = function(){
        //整个文档的高度
        var clientH = $( document).height()-0;
        //滚动条滚动的高度
        var scrollH = $( window ).scrollTop()-0;
        //当前浏览器窗口的高度
        var pageH = window.innerHeight-0;
        if(scrollH>pageH){
            $('.toTop_main_div').show();
        }else{
            $('.toTop_main_div').hide();
        }
    }

    /*
    * 20170409
    * 首页，当用户成功的登陆之后，获取用户的id号，
    * 然后去后端查询用户未读的消息。
    * */
    var userid = $('.head_meanu_userId').val();
    if(''==userid||undefined == userid){
       /*
       * 这种情况，表示当前没有用户登陆，所以不需要做任何操作。
       * */
    }else{
        /*
        * y用户已经成功的登陆了。所以需要发送请求，获取用户唯读取的条目数
        * */
        $.post(
            "../../../../user/getMessageNum",
            {userId:userid-0},
            function(data){
                //alert(data.Num);
                var messageNum = data.Num-0;
                if(messageNum>=1){//如果消息数大于1 ，就需要在页面上做样式的处理
                    $('.head_userInfo_logo').show();
                    $('.head_meanu_message').html('个人消息：<span style="color: red"><b>'+messageNum+'条未读消息</b></span>');
                }
            },'json'
        );
    }
});

