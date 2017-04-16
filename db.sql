/*
SQLyog Ultimate v8.32 
MySQL - 5.5.36 : Database - photo
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`photo` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `photo`;

/*Table structure for table `area` */

DROP TABLE IF EXISTS `area`;

CREATE TABLE `area` (
  `area_id` int(4) NOT NULL AUTO_INCREMENT,
  `area_name` varchar(10) NOT NULL,
  `city_id` int(4) NOT NULL,
  PRIMARY KEY (`area_id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Data for the table `area` */

insert  into `area`(`area_id`,`area_name`,`city_id`) values (1,'雁塔区',5),(2,'碑林区',5),(3,'高兴区',5),(4,'陇县',6),(5,'眉县',6),(6,'七里河区',7),(7,'秦州区',8),(8,'甘谷县',8);

/*Table structure for table `city` */

DROP TABLE IF EXISTS `city`;

CREATE TABLE `city` (
  `city_id` int(4) NOT NULL AUTO_INCREMENT,
  `city_name` varchar(10) NOT NULL,
  `provice_id` int(4) NOT NULL,
  PRIMARY KEY (`city_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Data for the table `city` */

insert  into `city`(`city_id`,`city_name`,`provice_id`) values (1,'东城区',1),(2,'海淀区',1),(3,'黄浦区',2),(4,'浦东区',2),(5,'西安市',3),(6,'宝鸡市',3),(7,'兰州市',4),(8,'天水市',4),(9,'石家庄市',5),(10,'保定市',5);

/*Table structure for table `comment` */

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  `photoID` int(11) NOT NULL COMMENT '被评论的照片ID.。。与photo表里的photoID 对应。',
  `userID` int(11) NOT NULL COMMENT '评论者的ID，与user表里的userID对应',
  `commentContent` varchar(200) DEFAULT NULL COMMENT '评论的内容',
  `commentTime` datetime DEFAULT NULL COMMENT '评论的时间',
  `commentState` tinyint(4) DEFAULT '0' COMMENT '改评论是否被用户阅读。0：没有阅读，1,：已经阅读..默认为0',
  `commentToUser` int(11) DEFAULT NULL COMMENT '评论谁。。如果是直接对于照片的评论，则这个字段为空'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `comment` */

insert  into `comment`(`photoID`,`userID`,`commentContent`,`commentTime`,`commentState`,`commentToUser`) values (54,21,'yangkai','2017-04-09 16:19:08',1,25),(50,25,'beijing','2017-04-09 16:25:20',1,21),(52,25,'beijing','2017-04-09 16:26:07',1,21);

/*Table structure for table `focus` */

DROP TABLE IF EXISTS `focus`;

CREATE TABLE `focus` (
  `focus_Uid` int(5) NOT NULL COMMENT '用户，也就是关注的人，和user表中的userID对应',
  `focus_Wid` int(5) NOT NULL COMMENT '被关注的人，和user表中的userID对应。',
  `focus_Time` datetime NOT NULL COMMENT '关注的时间',
  `focu_State` tinyint(4) NOT NULL DEFAULT '0' COMMENT '被关注这条动态是否被阅读，默认是0，表示没有阅读，1表示已经被阅读'
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

/*Data for the table `focus` */

insert  into `focus`(`focus_Uid`,`focus_Wid`,`focus_Time`,`focu_State`) values (21,25,'2017-04-16 12:11:27',0),(25,21,'2017-04-09 16:17:02',1);

/*Table structure for table `love` */

DROP TABLE IF EXISTS `love`;

CREATE TABLE `love` (
  `love_Uid` int(10) NOT NULL COMMENT '点赞的用户。和user表中的userid对应。',
  `love_Pid` int(10) NOT NULL COMMENT '被点赞的照片id，和photo表中的id对应。',
  `love_Time` datetime NOT NULL COMMENT '点赞的时间',
  `love_State` tinyint(4) NOT NULL DEFAULT '0' COMMENT '被点赞这条状态是否被阅读，默认是0 ，表示没有阅读，1表示已经被阅读。',
  PRIMARY KEY (`love_Uid`,`love_Pid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `love` */

insert  into `love`(`love_Uid`,`love_Pid`,`love_Time`,`love_State`) values (21,53,'2017-04-09 16:26:33',1),(25,50,'2017-04-09 16:25:17',1);

/*Table structure for table `photo` */

DROP TABLE IF EXISTS `photo`;

CREATE TABLE `photo` (
  `photoId` int(11) NOT NULL AUTO_INCREMENT COMMENT '照片的ID',
  `photoName` varchar(200) DEFAULT NULL COMMENT '照片的名字。。数据库里保存使用的，是个随机串',
  `photoUser` int(11) NOT NULL COMMENT '照片的上传者,改字段对应user表里的userID',
  `photoAddress` varchar(50) DEFAULT NULL COMMENT '照片的拍摄地方',
  `photoCreatetime` datetime DEFAULT NULL COMMENT '照片的拍摄时间',
  `photoUpdatetime` datetime DEFAULT NULL COMMENT '照片的上传时间',
  `photoIntroduce` varchar(200) DEFAULT NULL COMMENT '照片的介绍',
  `phototState` tinyint(4) DEFAULT '1' COMMENT '改动态是否被阅读。0：没有阅读，1：已经阅读',
  `photoNiname` varchar(100) DEFAULT NULL COMMENT '照片的名字。。和第一个名字不一样的是：这个供页面显示使用，比较文艺类型的名字',
  PRIMARY KEY (`photoId`)
) ENGINE=InnoDB AUTO_INCREMENT=57 DEFAULT CHARSET=utf8;

/*Data for the table `photo` */

insert  into `photo`(`photoId`,`photoName`,`photoUser`,`photoAddress`,`photoCreatetime`,`photoUpdatetime`,`photoIntroduce`,`phototState`,`photoNiname`) values (50,'x0lwRfkq77IV1To9CX-20170409161448.jpg',21,'address','2013-03-12 00:00:00','2017-04-09 16:14:48','intriduce',1,'computer'),(51,'v7uk4O6SfQp1jBbDNN-20170409161512.jpg',21,'天水师院','2016-03-11 00:00:00','2017-04-09 16:15:12','天水地势西北高，东南低，海拔在1000—2100米之间。属温带季风气候。',1,'Yangk的签名'),(52,'LOHuzxbVg14sGFQMPz-20170409161534.jpg',21,'天水师院','2016-03-11 00:00:00','2017-04-09 16:15:34','天水在夏、商时期属雍州，周孝王十二年（公元前九世纪）赢非子在秦池（今张家川县城南一带）为王室养马有功被封于秦，号赢秦。秦即后世的秦亭，是今天水市辖区见于史籍的最早地名。',1,'Yangk的签名-2'),(53,'bggsTK8Z4lJwdMY3HH-2017040916161.jpg',21,'天水师院','2016-03-11 00:00:00','2017-04-09 16:16:01','西汉武帝元鼎三年（前114年），从陇西、北地二郡析置天水郡。从此有“天水”的名称。',1,'苹果'),(54,'ptajHEFAkA4R7hrJGO-20170409161648.jpg',25,'安徽','2017-03-24 00:00:00','2017-04-09 16:16:48','应怜屐齿印苍苔，小扣柴扉久不开。 春色满园关不住，一枝红杏出墙来。',1,'表情包'),(55,'dtiJhmxEgQMA0Mitk9-2017040916208.jpg',25,'甘肃','2017-03-24 00:00:00','2017-04-09 16:20:08','西汉武帝元鼎三年（前114年），从陇西、北地二郡析置天水郡。从此有“天水”的名称。',1,'Yangk的签名-2'),(56,'wUWn9uLvFDiECzDASP-20170409162037.jpg',25,'天水师院','2013-03-12 00:00:00','2017-04-09 16:20:37','应怜屐齿印苍苔，小扣柴扉久不开。 春色满园关不住，一枝红杏出墙来。',1,'Yangk的签名');

/*Table structure for table `provice` */

DROP TABLE IF EXISTS `provice`;

CREATE TABLE `provice` (
  `provice_id` int(3) NOT NULL AUTO_INCREMENT,
  `provice_name` varchar(10) NOT NULL,
  PRIMARY KEY (`provice_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `provice` */

insert  into `provice`(`provice_id`,`provice_name`) values (1,'北京'),(2,'上海'),(3,'陕西'),(4,'甘肃'),(5,'河北');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `userId` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `userName` varchar(40) DEFAULT NULL COMMENT '用户名',
  `userPassword` varchar(50) DEFAULT NULL COMMENT '用户密码',
  `userEmail` varchar(50) DEFAULT NULL COMMENT '用户邮箱',
  `userSex` tinyint(4) DEFAULT '1' COMMENT '用户性别，1，表示男，0 表示女..默认为男',
  `userAddress` varchar(50) DEFAULT NULL COMMENT '用户地址',
  `userIntroduce` varchar(200) DEFAULT NULL COMMENT '用户的介绍',
  `userState` tinyint(4) DEFAULT '0' COMMENT '用户状态。0：正常，1：被禁止发表文章，2：禁止登陆',
  `userHead` varchar(150) DEFAULT NULL COMMENT '用户的头像,是一个照片的名字.',
  `userType` tinyint(4) DEFAULT '1' COMMENT '用户的类型：1-10,表示普通用户,11-20,普通管理员,大于20,超级管理员。..默认是1',
  `userBack` varchar(150) DEFAULT '../background/user_focus.jpg' COMMENT '用户自定义的背景图。。默认是../background/user_focus.jpg',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`userId`,`userName`,`userPassword`,`userEmail`,`userSex`,`userAddress`,`userIntroduce`,`userState`,`userHead`,`userType`,`userBack`) values (21,'yangkai','6dfcac158b08f9234f0b569dd9c5ed87','yangkai',0,'yangkai','yangkai',0,'0.jpg',31,'../background/user_focus.jpg'),(22,'tianshui','e6693bc8a4d385de3735da075f5f9c86','tianshui',0,'tianshui','tianshui',0,'0.jpg',1,'../background/user_focus.jpg'),(25,'beijing','0420a206ae8b77b60f314a33b38c875a','',1,NULL,'fddffdxf',0,'1.jpg',1,'../background/user_focus.jpg'),(41,'testuser','5d9c68c6c50ed3d02a2fcf54f63993b6','testuser@110.com',1,'甘肃%4-兰州市%7-七里河区%6','testuser',0,'1.jpg',1,'../background/user_focus.jpg');

/* Procedure structure for procedure `insert_comment` */

/*!50003 DROP PROCEDURE IF EXISTS  `insert_comment` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_comment`(
  IN photoID INT (11),
  IN userID INT (11),
  IN commentContent VARCHAR (200),
  IN commentTime DATETIME,
  IN commentToUser INT (11)
)
BEGIN
INSERT INTO comment (
    `photoID`,
    `userID`,
    `commentContent`,
    `commentTime`,
    `commentToUser`
  ) 
  VALUES
    (
      photoID,
      userID,
      commentContent,
      NOW(),
      commentToUser
    ) ;
  commit ;
END */$$
DELIMITER ;

/* Procedure structure for procedure `insert_photo` */

/*!50003 DROP PROCEDURE IF EXISTS  `insert_photo` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_photo`(
IN photoName varchar(50),
IN photoUser int(11),
IN photoAddress VARCHAR(50),
IN photoCreatetime datetime ,
IN photoIntroduce VARCHAR(200))
BEGIN
INSERT INTO photo (
  `photoName`,
  `photoUser`,
  `photoAddress`,
  `photoCreatetime`,
  `photoUpdatetime`,
  `photoIntroduce`
) 
VALUES
  (
   photoName,
   photoUser,
   photoAddress ,
   photoCreatetime ,
   now(),
   photoIntroduce
  ) ;
  commit;
  END */$$
DELIMITER ;

/* Procedure structure for procedure `insert_user` */

/*!50003 DROP PROCEDURE IF EXISTS  `insert_user` */;

DELIMITER $$

/*!50003 CREATE DEFINER=`root`@`localhost` PROCEDURE `insert_user`(
in userName varchar(40),
IN userPassword VARCHAR(50),
IN userEmail VARCHAR(50),
IN userSex tinyint(4),
IN userAddress VARCHAR(200),
IN userIntroduce VARCHAR(50),
IN userHead VARCHAR(150))
begin
insert into `photo`.`user` (
  `userName`,
  `userPassword`,
  `userEmail`,
  `userSex`,
  `userAddress`,
  `userIntroduce`,
  `userHead`,
   usertype
) 
values
  (
    userName,
    userPassword,
    userEmail,
    userSex,
    userAddress,
    userIntroduce,
    userHead,
    1
  ) ;
 
  end */$$
DELIMITER ;

/*Table structure for table `message_0` */

DROP TABLE IF EXISTS `message_0`;

/*!50001 DROP VIEW IF EXISTS `message_0` */;
/*!50001 DROP TABLE IF EXISTS `message_0` */;

/*!50001 CREATE TABLE  `message_0`(
 `message_Type` int(1) ,
 `message_toId` int(11) ,
 `message_Time` datetime ,
 `message_Uid` int(10) ,
 `message_userName` varchar(40) ,
 `message_userBack` varchar(150) ,
 `message_State` tinyint(4) ,
 `message_L_pid` int(10) ,
 `message_L_photoName` varchar(200) ,
 `message_L_photoNiname` varchar(100) ,
 `message_L_photoUpdatetime` datetime ,
 `message_C_commentContent` binary(0) ,
 `message_C_photoName` binary(0) ,
 `message_C_photoNiname` binary(0) ,
 `message_C_photoUpdatetime` binary(0) 
)*/;

/*Table structure for table `message_1` */

DROP TABLE IF EXISTS `message_1`;

/*!50001 DROP VIEW IF EXISTS `message_1` */;
/*!50001 DROP TABLE IF EXISTS `message_1` */;

/*!50001 CREATE TABLE  `message_1`(
 `message_Type` int(1) ,
 `message_toId` int(11) ,
 `message_Time` datetime ,
 `message_Uid` int(11) ,
 `message_userName` varchar(40) ,
 `message_userBack` varchar(150) ,
 `message_State` tinyint(4) ,
 `message_L_pid` binary(0) ,
 `message_L_photoName` binary(0) ,
 `message_L_photoNiname` binary(0) ,
 `message_L_photoUpdatetime` binary(0) ,
 `message_C_commentContent` varchar(200) ,
 `message_C_photoName` varchar(200) ,
 `message_C_photoNiname` varchar(100) ,
 `message_C_photoUpdatetime` datetime 
)*/;

/*Table structure for table `message_2` */

DROP TABLE IF EXISTS `message_2`;

/*!50001 DROP VIEW IF EXISTS `message_2` */;
/*!50001 DROP TABLE IF EXISTS `message_2` */;

/*!50001 CREATE TABLE  `message_2`(
 `message_Type` int(1) ,
 `message_toId` int(5) ,
 `message_Time` datetime ,
 `message_Uid` int(5) ,
 `message_userName` varchar(40) ,
 `message_userBack` varchar(150) ,
 `message_State` tinyint(4) ,
 `message_L_pid` binary(0) ,
 `message_L_photoName` binary(0) ,
 `message_L_photoNiname` binary(0) ,
 `message_L_photoUpdatetime` binary(0) ,
 `message_C_commentContent` binary(0) ,
 `message_C_photoName` binary(0) ,
 `message_C_photoNiname` binary(0) ,
 `message_C_photoUpdatetime` binary(0) 
)*/;

/*View structure for view message_0 */

/*!50001 DROP TABLE IF EXISTS `message_0` */;
/*!50001 DROP VIEW IF EXISTS `message_0` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `message_0` AS select 0 AS `message_Type`,`touser`.`userId` AS `message_toId`,`love`.`love_Time` AS `message_Time`,`love`.`love_Uid` AS `message_Uid`,`love_u`.`userName` AS `message_userName`,`love_u`.`userBack` AS `message_userBack`,`love`.`love_State` AS `message_State`,`love`.`love_Pid` AS `message_L_pid`,`photo`.`photoName` AS `message_L_photoName`,`photo`.`photoNiname` AS `message_L_photoNiname`,`photo`.`photoUpdatetime` AS `message_L_photoUpdatetime`,NULL AS `message_C_commentContent`,NULL AS `message_C_photoName`,NULL AS `message_C_photoNiname`,NULL AS `message_C_photoUpdatetime` from (((`love` join `user` `love_u`) join `photo`) join `user` `touser`) where ((`love`.`love_Uid` = `love_u`.`userId`) and (`love`.`love_Pid` = `photo`.`photoId`) and (`photo`.`photoUser` = `touser`.`userId`)) */;

/*View structure for view message_1 */

/*!50001 DROP TABLE IF EXISTS `message_1` */;
/*!50001 DROP VIEW IF EXISTS `message_1` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `message_1` AS select 1 AS `message_Type`,`comment`.`commentToUser` AS `message_toId`,`comment`.`commentTime` AS `message_Time`,`comment`.`userID` AS `message_Uid`,`user`.`userName` AS `message_userName`,`user`.`userBack` AS `message_userBack`,`comment`.`commentState` AS `message_State`,NULL AS `message_L_pid`,NULL AS `message_L_photoName`,NULL AS `message_L_photoNiname`,NULL AS `message_L_photoUpdatetime`,`comment`.`commentContent` AS `message_C_commentContent`,`photo`.`photoName` AS `message_C_photoName`,`photo`.`photoNiname` AS `message_C_photoNiname`,`photo`.`photoUpdatetime` AS `message_C_photoUpdatetime` from ((`comment` join `user`) join `photo`) where ((`comment`.`photoID` = `photo`.`photoId`) and (`comment`.`userID` = `user`.`userId`)) */;

/*View structure for view message_2 */

/*!50001 DROP TABLE IF EXISTS `message_2` */;
/*!50001 DROP VIEW IF EXISTS `message_2` */;

/*!50001 CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `message_2` AS select 2 AS `message_Type`,`focus`.`focus_Wid` AS `message_toId`,`focus`.`focus_Time` AS `message_Time`,`focus`.`focus_Uid` AS `message_Uid`,`user`.`userName` AS `message_userName`,`user`.`userBack` AS `message_userBack`,`focus`.`focu_State` AS `message_State`,NULL AS `message_L_pid`,NULL AS `message_L_photoName`,NULL AS `message_L_photoNiname`,NULL AS `message_L_photoUpdatetime`,NULL AS `message_C_commentContent`,NULL AS `message_C_photoName`,NULL AS `message_C_photoNiname`,NULL AS `message_C_photoUpdatetime` from (`focus` join `user`) where (`focus`.`focus_Uid` = `user`.`userId`) */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
