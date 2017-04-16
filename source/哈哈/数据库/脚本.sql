/*
SQLyog Ultimate v12.09 (64 bit)
MySQL - 5.5.28 : Database - photo
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

insert  into `comment`(`photoID`,`userID`,`commentContent`,`commentTime`,`commentState`,`commentToUser`) values (4,4,'dizhi','2017-03-17 17:06:47',0,3);

/*Table structure for table `photo` */

DROP TABLE IF EXISTS `photo`;

CREATE TABLE `photo` (
  `photoId` int(11) NOT NULL AUTO_INCREMENT COMMENT '照片的ID',
  `photoName` varchar(50) DEFAULT NULL COMMENT '照片的名字',
  `photoUser` int(11) NOT NULL COMMENT '照片的上传者,改字段对应user表里的userID',
  `photoAddress` varchar(50) DEFAULT NULL COMMENT '照片的拍摄地方',
  `photoCreatetime` datetime DEFAULT NULL COMMENT '照片的拍摄时间',
  `photoUpdatetime` datetime DEFAULT NULL COMMENT '照片的上传时间',
  `photoIntroduce` varchar(200) DEFAULT NULL COMMENT '照片的介绍',
  `phototState` tinyint(4) DEFAULT '1' COMMENT '改动态是否被阅读。0：没有阅读，1：已经阅读',
  PRIMARY KEY (`photoId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `photo` */

insert  into `photo`(`photoId`,`photoName`,`photoUser`,`photoAddress`,`photoCreatetime`,`photoUpdatetime`,`photoIntroduce`,`phototState`) values (1,'y22k',1,'dizhi','2017-03-17 16:30:24','2017-03-17 16:30:24','嘻嘻哈哈',1),(2,'y22k',2,'dizhi','2017-03-17 16:31:10','2017-03-17 16:31:10','嘻嘻哈哈',1),(3,'y22k',3,'dizhi','2017-03-17 16:32:06','2017-03-17 16:32:06','嘻嘻哈哈',1),(4,'y22k',4,'dizhi','2017-03-17 16:32:17','2017-03-17 16:32:17','嘻嘻哈哈',1);

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
  `userType` tinyint(4) DEFAULT NULL COMMENT '用户的类型：1-10,表示普通用户,11-20,普通管理员,大于20,超级管理员。',
  PRIMARY KEY (`userId`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`userId`,`userName`,`userPassword`,`userEmail`,`userSex`,`userAddress`,`userIntroduce`,`userState`,`userHead`,`userType`) values (1,'yk','yk','yi@163.com',0,'tianjing','haha',0,'嘻嘻哈哈',NULL);

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
  `userHead`
) 
values
  (
    userName,
    userPassword,
    userEmail,
    userSex,
    userAddress,
    userIntroduce,
    userHead
  ) ;
 
  end */$$
DELIMITER ;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
