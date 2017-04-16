/*
* 20170321
* 照片的实体类
* */
var photo  = function(){

};

photo.photoId;
photo.photoName;
photo.photoUser;
photo.photoAddress;
photo.photoCreatetime;
photo.photoUpdatetime;
photo.photoIntroduce;
photo.phototState;
/*
* 20170322
*
* 这是之前数据库设计的时候埋下的坑。
* 竟然没有给名字这个字段。
* 竟然犯了这么低级的错误。
* 虽然添加字段是很容易的。。
* 以后在数据库设计的时候要认真仔细的设计，这是很重要的环节。
* */
photo.photoNiname;

module.exports = photo ;