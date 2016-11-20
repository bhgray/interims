-- phpMyAdmin SQL Dump
-- version 2.6.2-pl1
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generation Time: Dec 14, 2005 at 12:26 PM
-- Server version: 4.0.24
-- PHP Version: 4.3.11
-- 
-- Database: `bhgray`
-- 

-- --------------------------------------------------------

-- 
-- Table structure for table `int_codes`
-- 

DROP TABLE IF EXISTS `int_codes`;
CREATE TABLE IF NOT EXISTS `int_codes` (
  `code` tinyint(2) NOT NULL default '0',
  `text` varchar(50) NOT NULL default '',
  PRIMARY KEY  (`code`)
) TYPE=MyISAM;

-- 
-- Dumping data for table `int_codes`
-- 

INSERT INTO `int_codes` VALUES (1, 'Following Directions');
INSERT INTO `int_codes` VALUES (2, 'Following Directions');
INSERT INTO `int_codes` VALUES (3, 'Reliability and Dependability');
INSERT INTO `int_codes` VALUES (4, 'Reliability and Dependability');
INSERT INTO `int_codes` VALUES (5, 'Meeting Deadlines');
INSERT INTO `int_codes` VALUES (6, 'Meeting Deadlines');
INSERT INTO `int_codes` VALUES (7, 'Mastering Skills');
INSERT INTO `int_codes` VALUES (8, 'Mastering Skills');
INSERT INTO `int_codes` VALUES (9, 'Consistency');
INSERT INTO `int_codes` VALUES (10, 'Consistency');
INSERT INTO `int_codes` VALUES (11, 'Preparation');
INSERT INTO `int_codes` VALUES (12, 'Preparation');
INSERT INTO `int_codes` VALUES (14, 'Organization');
INSERT INTO `int_codes` VALUES (13, 'Organization');
INSERT INTO `int_codes` VALUES (15, 'Participation');
INSERT INTO `int_codes` VALUES (16, 'Participation');
INSERT INTO `int_codes` VALUES (17, 'Creativity');
INSERT INTO `int_codes` VALUES (18, 'Creativity');
INSERT INTO `int_codes` VALUES (19, 'Homework');
INSERT INTO `int_codes` VALUES (20, 'Homework');
INSERT INTO `int_codes` VALUES (21, 'Quiz Results');
INSERT INTO `int_codes` VALUES (22, 'Quiz Results');
INSERT INTO `int_codes` VALUES (23, 'Test Results');
INSERT INTO `int_codes` VALUES (24, 'Test Results');
INSERT INTO `int_codes` VALUES (25, 'Enjoying Learning');
INSERT INTO `int_codes` VALUES (26, 'Enjoying Learning');
INSERT INTO `int_codes` VALUES (27, 'Accepting Suggestions');
INSERT INTO `int_codes` VALUES (28, 'Accepting Suggestions');
INSERT INTO `int_codes` VALUES (29, 'Group Interaction');
INSERT INTO `int_codes` VALUES (30, 'Group Interaction');
INSERT INTO `int_codes` VALUES (31, 'Behavior');
INSERT INTO `int_codes` VALUES (32, 'Behavior');
INSERT INTO `int_codes` VALUES (33, 'Attentiveness');
INSERT INTO `int_codes` VALUES (34, 'Attentiveness');
INSERT INTO `int_codes` VALUES (35, 'Motivation / Effort');
INSERT INTO `int_codes` VALUES (36, 'Motivation / Effort');
INSERT INTO `int_codes` VALUES (37, 'Punctuality');
INSERT INTO `int_codes` VALUES (38, 'Punctuality');
INSERT INTO `int_codes` VALUES (39, 'Cooperation');
INSERT INTO `int_codes` VALUES (40, 'Cooperation');
INSERT INTO `int_codes` VALUES (41, 'Leadership');
INSERT INTO `int_codes` VALUES (42, 'Leadership');
INSERT INTO `int_codes` VALUES (43, 'Class Attendance');
INSERT INTO `int_codes` VALUES (44, 'Class Attendance');
INSERT INTO `int_codes` VALUES (46, 'Call for Parent Conference');
INSERT INTO `int_codes` VALUES (97, 'Danger of Failing Marking Period');
INSERT INTO `int_codes` VALUES (99, 'Danger of Failing Year');

-- --------------------------------------------------------

-- 
-- Table structure for table `int_courses`
-- 

DROP TABLE IF EXISTS `int_courses`;
CREATE TABLE IF NOT EXISTS `int_courses` (
  `courseID` varchar(15) NOT NULL default '',
  `teacherID` varchar(15) NOT NULL default '',
  `title` varchar(50) NOT NULL default '',
  PRIMARY KEY  (`courseID`)
) TYPE=MyISAM;

-- 
-- Dumping data for table `int_courses`
-- 

INSERT INTO `int_courses` VALUES ('6185', 'MBG', 'Algebra 2 7/8');
INSERT INTO `int_courses` VALUES ('6388', 'MBG', 'Elementary Functions 5/6');

-- --------------------------------------------------------

-- 
-- Table structure for table `int_defaults`
-- 

DROP TABLE IF EXISTS `int_defaults`;
CREATE TABLE IF NOT EXISTS `int_defaults` (
  `id` int(5) NOT NULL auto_increment,
  `key` varchar(25) NOT NULL default '',
  `value` varchar(100) NOT NULL default '',
  PRIMARY KEY  (`id`)
) TYPE=MyISAM AUTO_INCREMENT=9 ;

-- 
-- Dumping data for table `int_defaults`
-- 

INSERT INTO `int_defaults` VALUES (1, 'school_name', 'The High School of Engineering and Science');
INSERT INTO `int_defaults` VALUES (2, 'school_st_address', '1600 West Norris Street');
INSERT INTO `int_defaults` VALUES (3, 'school_city', 'Philadelphia');
INSERT INTO `int_defaults` VALUES (4, 'school_zip', '19121');
INSERT INTO `int_defaults` VALUES (5, 'school_telephone', '215-684-5079');
INSERT INTO `int_defaults` VALUES (6, 'current_mp', '2');
INSERT INTO `int_defaults` VALUES (7, 'system_opens', '2005-12-01');
INSERT INTO `int_defaults` VALUES (8, 'system_closes', '2005-12-31');

-- --------------------------------------------------------

-- 
-- Table structure for table `int_rosters`
-- 

DROP TABLE IF EXISTS `int_rosters`;
CREATE TABLE IF NOT EXISTS `int_rosters` (
  `studentID` varchar(7) NOT NULL default '',
  `courseID` varchar(10) NOT NULL default '',
  `satisfactory` varchar(50) default NULL,
  `unsatisfactory` varchar(50) default NULL,
  `failing` varchar(50) default NULL,
  `comments` varchar(50) default NULL,
  `danger` varchar(10) default 'false',
  `modified` timestamp(14) NOT NULL,
  `modified_by` varchar(30) default NULL,
  PRIMARY KEY  (`studentID`,`courseID`)
) TYPE=MyISAM;

-- 
-- Dumping data for table `int_rosters`
-- 

INSERT INTO `int_rosters` VALUES ('1111111', '6185', 'Joe is Satisfactory', '', '', '', 'false', '20051212070725', '');
INSERT INTO `int_rosters` VALUES ('2222222', '6185', 'sat', 'Lenne is not unsatisfactory', '', 'Lenne has no comment', 'false', '20051211210324', '');
INSERT INTO `int_rosters` VALUES ('1111111', '6388', 'sat as of 12/11', 'unsat as of 12/11', '', 'new comment as of 12/11', 'false', '20051211210337', '');

-- --------------------------------------------------------

-- 
-- Table structure for table `int_seeds`
-- 

DROP TABLE IF EXISTS `int_seeds`;
CREATE TABLE IF NOT EXISTS `int_seeds` (
  `id` int(11) NOT NULL auto_increment,
  `seed` timestamp(14) NOT NULL,
  PRIMARY KEY  (`id`)
) TYPE=MyISAM AUTO_INCREMENT=644 ;



-- --------------------------------------------------------

-- 
-- Table structure for table `int_students`
-- 

DROP TABLE IF EXISTS `int_students`;
CREATE TABLE IF NOT EXISTS `int_students` (
  `studentID` varchar(7) NOT NULL default '',
  `lastName` varchar(50) NOT NULL default '',
  `firstName` varchar(50) NOT NULL default '',
  `advisory` char(3) NOT NULL default ''
) TYPE=MyISAM;

-- 
-- Dumping data for table `int_students`
-- 

INSERT INTO `int_students` VALUES ('1111111', 'Hudson', 'Joseph', '203');
INSERT INTO `int_students` VALUES ('2222222', 'Hawkins', 'Lenne', '201');
INSERT INTO `int_students` VALUES ('3333333', 'Hawkins', 'Johnathan', '201');
INSERT INTO `int_students` VALUES ('4444444', 'Karriem', 'Asia', '203');
INSERT INTO `int_students` VALUES ('5555555', 'Noel', 'Leon', '210');
INSERT INTO `int_students` VALUES ('6666666', 'Manzur', 'Giovanni', '210');

-- --------------------------------------------------------

-- 
-- Table structure for table `int_teachers`
-- 

DROP TABLE IF EXISTS `int_teachers`;
CREATE TABLE IF NOT EXISTS `int_teachers` (
  `teacherID` int(11) NOT NULL auto_increment,
  `schoolDistrictID` varchar(11) default NULL,
  `lastName` varchar(50) default NULL,
  `firstName` varchar(50) default NULL,
  `username` varchar(20) default NULL,
  `active` char(1) binary default '0',
  `password` varchar(40) default NULL,
  `auth_level` varchar(5) binary NOT NULL default '00001',
  `creation` datetime NOT NULL default '0000-00-00 00:00:00',
  `last_login` datetime default NULL,
  `last_modified` timestamp(14) NOT NULL,
  PRIMARY KEY  (`teacherID`)
) TYPE=MyISAM AUTO_INCREMENT=5 ;

-- 
-- Dumping data for table `int_teachers`
-- 

INSERT INTO `int_teachers` VALUES (1, 'MBG', 'Gray', 'Brent', 'grayb', 0x31, 'password', 0x3131313131, '0000-00-00 00:00:00', '2005-11-29 18:55:58', '20051201180800');
INSERT INTO `int_teachers` VALUES (2, 'MJK', 'Kalicki', 'John', 'kalickij', 0x31, 'tabasco', 0x3030303031, '0000-00-00 00:00:00', '2005-11-29 06:50:01', '20051201180833');
INSERT INTO `int_teachers` VALUES (3, 'HRH', 'Haenn', 'Robert','haennr',  0x30, 'password', 0x3030303031, '0000-00-00 00:00:00', '2005-11-29 06:50:01', '20051201180852');
INSERT INTO `int_teachers` VALUES (4, 'EJD', 'Dougherty', 'Joseph', 'doughertyj', 0x30, 'password', 0x3030303031, '0000-00-00 00:00:00', '2005-11-29 06:50:01', '20051201180909');
