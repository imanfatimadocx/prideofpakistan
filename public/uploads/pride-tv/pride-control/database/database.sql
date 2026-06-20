-- phpMyAdmin SQL Dump
-- version 3.3.9
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Aug 02, 2014 at 06:40 PM
-- Server version: 5.5.20
-- PHP Version: 5.3.10

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `onlinequran`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin_log`
--

CREATE TABLE IF NOT EXISTS `admin_log` (
  `logid` int(8) NOT NULL AUTO_INCREMENT,
  `logdatetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lognotes` varchar(255) NOT NULL,
  `logstatus` int(1) NOT NULL,
  `logip` varchar(30) NOT NULL,
  PRIMARY KEY (`logid`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `admin_log`
--

INSERT INTO `admin_log` (`logid`, `logdatetime`, `lognotes`, `logstatus`, `logip`) VALUES
(1, '2013-11-21 07:35:00', 'my notes', 0, '192.168.1.1'),
(2, '2013-11-21 07:49:43', 'Content Page [  ] Deleted...!', 0, '127.0.0.1'),
(3, '2013-11-21 07:50:16', 'Content Page [  ] Deleted...!', 0, '127.0.0.1'),
(4, '2013-12-03 11:28:44', 'Teacher [  ] Deleted...!', 0, '127.0.0.1'),
(5, '2013-12-03 11:28:46', 'Teacher [  ] Deleted...!', 0, '127.0.0.1'),
(6, '2014-06-24 02:14:23', 'Class [ Test class 1 ] Deleted...!', 0, '127.0.0.1');

-- --------------------------------------------------------

--
-- Table structure for table `admin_setting`
--

CREATE TABLE IF NOT EXISTS `admin_setting` (
  `option_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `option_name` varchar(64) NOT NULL DEFAULT '',
  `option_value` longtext NOT NULL,
  `options_title` varchar(100) NOT NULL,
  `autoload` varchar(20) NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`option_id`),
  UNIQUE KEY `option_name` (`option_name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=458 ;

--
-- Dumping data for table `admin_setting`
--

INSERT INTO `admin_setting` (`option_id`, `option_name`, `option_value`, `options_title`, `autoload`) VALUES
(1, 'siteurl', 'http://localhost/onlinequran/', 'Site URL', 'yes'),
(2, 'sitename', 'Learnings', 'Site Name', 'yes'),
(3, 'admin_email', 'malik.shaheryar@hotmail.com', 'Admin Email Address', 'yes'),
(4, 'free_classes', '3', 'Allow Free Classes', 'yes'),
(457, 'free_organization', '3', 'Allow Free Organization', 'yes');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE IF NOT EXISTS `classes` (
  `class_id` int(8) NOT NULL AUTO_INCREMENT,
  `class_userid` int(4) NOT NULL,
  `class_organization` text NOT NULL,
  `class_name` varchar(150) NOT NULL,
  `class_desc` text NOT NULL,
  `class_status` varchar(10) NOT NULL,
  PRIMARY KEY (`class_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=9 ;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`class_id`, `class_userid`, `class_organization`, `class_name`, `class_desc`, `class_status`) VALUES
(1, 0, '1', 'Shaheryar Malik', '<p>this is my school....</p>', 'active'),
(4, 0, '1,2', 'T1', '<p>T1 Desc</p>', 'active'),
(6, 2, '', 'adada', '<p>sdasdasdas</p>', 'active'),
(7, 2, '3,1', 'dasdada', '<p>dadasdasdasdas</p>', 'active'),
(8, 2, '1', '', '', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `contents`
--

CREATE TABLE IF NOT EXISTS `contents` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `content_title` varchar(255) DEFAULT NULL,
  `page_title` varchar(255) NOT NULL,
  `content_desc` longtext,
  `description` varchar(255) DEFAULT NULL,
  `keywords` varchar(255) DEFAULT NULL,
  `author` varchar(255) DEFAULT NULL,
  `robots` varchar(255) NOT NULL DEFAULT 'index,follow',
  `orderid` int(11) NOT NULL DEFAULT '0',
  `page_physical_name` varchar(255) DEFAULT NULL,
  `status` enum('active','block') NOT NULL,
  `page_modify_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `page_create_date` datetime NOT NULL,
  `header_image_default` int(11) NOT NULL DEFAULT '0',
  `header_image_text` varchar(255) NOT NULL,
  `promotional_page` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Dumping data for table `contents`
--

INSERT INTO `contents` (`id`, `content_title`, `page_title`, `content_desc`, `description`, `keywords`, `author`, `robots`, `orderid`, `page_physical_name`, `status`, `page_modify_date`, `page_create_date`, `header_image_default`, `header_image_text`, `promotional_page`) VALUES
(1, 'Welcome', 'Welcome', '<p>Welcome content fads</p><p>fas&nbsp;</p><p>fas</p><p>&nbsp;f</p><p>as</p><p>&nbsp;fdsa''''''f as</p><p>f as</p><p>fasd</p>', 'Welcome', 'Welcome', 'Welcome', 'index,follow', 0, 'index.htm', 'active', '2013-12-02 17:13:10', '0000-00-00 00:00:00', 0, '', 0),
(5, 'f asf asf s', 'jklfaskjl', '<p>daf asdf asdfas</p>', 'jfklasjflaskjf', 'jfklasjflkasj', NULL, 'index,follow', 0, 'page-not-found.htm', 'block', '2013-12-02 17:14:07', '2013-12-03 06:13:57', 0, '', 0),
(6, 'dasdsad', 'asda', '<p>dsad as das das</p>', 'sada', 'sdasd', NULL, 'index,follow', 0, 'dasd', 'active', '2014-08-02 06:38:23', '2014-08-02 06:38:23', 0, '', 0);

-- --------------------------------------------------------

--
-- Table structure for table `optiondata`
--

CREATE TABLE IF NOT EXISTS `optiondata` (
  `OptionId` int(8) NOT NULL AUTO_INCREMENT,
  `OptionType` int(4) NOT NULL,
  `OptionName` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `OptionDesc` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`OptionId`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=100 ;

--
-- Dumping data for table `optiondata`
--


-- --------------------------------------------------------

--
-- Table structure for table `organizations`
--

CREATE TABLE IF NOT EXISTS `organizations` (
  `org_id` int(8) NOT NULL AUTO_INCREMENT,
  `org_userid` int(4) NOT NULL,
  `org_subdomain` varchar(255) NOT NULL,
  `org_title` varchar(150) NOT NULL,
  `org_desc` text NOT NULL,
  `org_status` varchar(10) NOT NULL,
  `org_createdate` datetime NOT NULL,
  PRIMARY KEY (`org_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `organizations`
--

INSERT INTO `organizations` (`org_id`, `org_userid`, `org_subdomain`, `org_title`, `org_desc`, `org_status`, `org_createdate`) VALUES
(1, 1, 'org1.localhost', 'Org 1', 'Org 1', 'active', '2013-12-04 00:00:00'),
(2, 0, 'org2.localhost', 'Org 2', 'Org 2', 'active', '2013-12-04 00:00:00'),
(3, 2, '', 'Friya school', '<p>This is me friya the head of my school</p>', 'active', '2013-12-06 02:58:32');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE IF NOT EXISTS `teachers` (
  `teacher_id` int(8) NOT NULL AUTO_INCREMENT,
  `teacher_userid` int(4) NOT NULL,
  `teacher_organization` text NOT NULL,
  `teacher_name` varchar(150) NOT NULL,
  `teacher_desc` text NOT NULL,
  `teacher_status` varchar(10) NOT NULL,
  PRIMARY KEY (`teacher_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`teacher_id`, `teacher_userid`, `teacher_organization`, `teacher_name`, `teacher_desc`, `teacher_status`) VALUES
(1, 0, '1', 'Shaheryar Malik', '<p>this is my school....</p>', 'active'),
(4, 0, '1,2', 'T1', '<p>T1 Desc</p>', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `typedata`
--

CREATE TABLE IF NOT EXISTS `typedata` (
  `TypeId` int(8) NOT NULL AUTO_INCREMENT,
  `TypeFieldName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `TypeDesc` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`TypeId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci AUTO_INCREMENT=1 ;

--
-- Dumping data for table `typedata`
--


-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `ID` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_email` varchar(60) NOT NULL DEFAULT '',
  `user_pass` text NOT NULL,
  `user_nicename` varchar(50) NOT NULL DEFAULT '',
  `user_url` varchar(100) NOT NULL DEFAULT '',
  `user_registered` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `user_activation_key` varchar(60) NOT NULL DEFAULT '',
  `user_status` int(11) NOT NULL DEFAULT '0',
  `display_name` varchar(250) NOT NULL DEFAULT '',
  `user_access` varchar(10) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `user_login_key` (`user_email`),
  KEY `user_nicename` (`user_nicename`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=3 ;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`ID`, `user_email`, `user_pass`, `user_nicename`, `user_url`, `user_registered`, `user_activation_key`, `user_status`, `display_name`, `user_access`) VALUES
(1, 'admin', 'QrUgcNdRjaE74hfEIeThKa/RaqA9N/KpBI+X7VeiyfE=', 'admin', '', '2013-11-08 14:29:12', '', 1, 'admin', '0'),
(2, 'friya@outlook.com', 'hx2XToT0cy5wZ9XRQS40AvJhgTj6JFhzCdhAFXUrCJw=', 'friya', '', '2013-12-06 02:49:22', '', 1, 'friya', 'user');
