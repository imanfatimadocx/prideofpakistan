

CREATE TABLE `admin_log` (
  `logid` int(8) NOT NULL AUTO_INCREMENT,
  `logdatetime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lognotes` varchar(255) NOT NULL,
  `logstatus` int(1) NOT NULL,
  `logip` varchar(30) NOT NULL,
  PRIMARY KEY (`logid`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;

INSERT INTO admin_log VALUES("1","2015-06-07 23:53:22","Video [ Naya Pakistan -07 Jun 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("2","2015-06-08 00:01:59","Video [ Hasb e Haal – 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("3","2015-06-08 00:02:26","Video [ Hasb e Haal – 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("4","2015-06-08 00:19:56","Video [ LAMBI JUDAAI - Atif with Reshma Ji in LSA08 ] Marked as Normal...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("5","2015-06-08 00:20:09","Video [ O Saathi re Tere Bina bhi kaya jina Atif Aslam Himesh Reshammiya and Asha Bhosle ] Marked as Normal...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("6","2015-06-08 00:20:29","Video [ Atif Aslam New Song Ab Ajaao 2015 ] Marked as Normal...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("7","2015-06-08 00:20:40","Video [ Atif Aslam singing Pehli Nazaar and Sajna Tere Bina In SurKshetra ] Marked as Normal...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("8","2015-06-08 00:20:54","Video [ Geo TV News ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("9","2015-06-08 00:21:00","Video [ How Agent of RAW Haseena Wajid Speaking Against Burma Muslims ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("10","2015-06-08 00:21:06","Video [ Aamir Liaqut is Threatening ARY News and Gone Mad ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("11","2015-06-08 00:22:09","Video [ How Agent of RAW Haseena Wajid Speaking Against Burma Muslims ] Marked as Normal...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("12","2015-06-08 00:22:15","Video [ Aamir Liaqut is Threatening ARY News and Gone Mad ] Marked as Normal...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("13","2015-06-08 00:25:17","Video [ The Reham Khan Show (Samina Baig is First Pakistani Woman to Scale Mount Everest along her brother Mirza Ali) – 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("14","2015-06-08 00:27:52","Video [  ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("15","2015-06-08 00:37:59","Video [ Hasb e Haal – 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("16","2015-06-08 00:48:18","Video [ Aapas ki Baat – 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("17","2015-06-08 00:52:27","Video [ News Beat - 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("18","2015-06-08 00:56:53","Video [ Sawal Yeh Hai - 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("19","2015-06-08 00:59:53","Video [ Aaj Rana Mubashir Kay Sath - 7th June 2015 - Nabil Gabol Exclusive Interview.. ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("20","2015-06-08 01:01:13","Video [ Hasb e Haal – 7th June 2015 ] Marked as Normal...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("21","2015-06-08 01:02:12","Video [ Hasb e Haal – 7th June 2015 ] Deleted...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("22","2015-06-08 01:02:20","Video [ Hasb e Haal – 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("23","2015-06-08 01:11:58","Video [ Live With Dr. Shahid Masood - 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("24","2015-06-08 02:05:40","Video [ Mere Mutabiq with Hassan Nisar – 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("25","2015-06-08 02:05:46","Video [ Power Play - 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("26","2015-06-08 02:10:18","Video [   03:11 Haram gosht bejnay ka kaarobar Karachi me urooj par.. Kuto ka gosht کتوں کا گوشت کراچی میں Haram gosht bejnay ka kaarobar Ka ] Deleted...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("27","2015-06-08 02:21:49","Video [ Geo TV News ] Marked as Normal...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("28","2015-06-08 02:22:02","Video [ Aamir Liaqut is Threatening ARY News and Gone Mad ] Marked as Normal...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("29","2015-06-08 02:22:30","Video [ How Agent of RAW Haseena Wajid Speaking Against Burma Muslims ] Marked as Normal...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("30","2015-06-08 02:27:06","Video [ Spot Light - 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("31","2015-06-08 02:31:02","Video [ Ikhtalafi Note - 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");
INSERT INTO admin_log VALUES("32","2015-06-08 02:40:23","Video [ Situation Room - 7th June 2015 ] Marked as Feature...!","0","101.50.69.107");





CREATE TABLE `admin_setting` (
  `option_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `option_name` varchar(64) NOT NULL DEFAULT '',
  `option_value` longtext NOT NULL,
  `options_title` varchar(100) NOT NULL,
  `autoload` varchar(20) NOT NULL DEFAULT 'yes',
  PRIMARY KEY (`option_id`),
  UNIQUE KEY `option_name` (`option_name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

INSERT INTO admin_setting VALUES("1","siteurl","http://www.PrideTV.com/beta/","Site URL","yes");
INSERT INTO admin_setting VALUES("2","sitename","Pride Tv","Site Name","yes");
INSERT INTO admin_setting VALUES("3","admin_email","ibuildsoft@gmail.com","Admin Email Address","yes");
INSERT INTO admin_setting VALUES("4","site_online","on","Site Online / Offline","yes");
INSERT INTO admin_setting VALUES("5","facebook","https://www.facebook.com/","Facebook URL","yes");
INSERT INTO admin_setting VALUES("6","google-plus","https://plus.google.com/","Google+ URL","yes");
INSERT INTO admin_setting VALUES("7","pinterest","https://pinterest.com/","Pinterest URL","yes");
INSERT INTO admin_setting VALUES("8","twitter","https://twitter.com/","Twitter URL","yes");





CREATE TABLE `category` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `orderid` int(11) NOT NULL DEFAULT '0',
  `description` text,
  `catid` int(11) DEFAULT NULL,
  `status` int(11) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1 ROW_FORMAT=COMPACT;

INSERT INTO category VALUES("1","Dramas","0","","0","1");
INSERT INTO category VALUES("2","Features","0","","0","1");
INSERT INTO category VALUES("3","Cooking","0","","2","1");
INSERT INTO category VALUES("4","Cartoon","0","","2","1");
INSERT INTO category VALUES("5","Sports","0","","2","1");
INSERT INTO category VALUES("6","Movies","0","","0","1");
INSERT INTO category VALUES("7","Music","0","","0","1");
INSERT INTO category VALUES("8","News","0","","0","1");





CREATE TABLE `contents` (
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
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

INSERT INTO contents VALUES("7","Privacy Policy","Privacy Policy","<p>Privacy Policy - Coming Soon</p>","Privacy Policy","Privacy Policy","","index,follow","0","policy.htm","active","2014-11-10 15:16:38","2014-11-10 12:14:56","0","","0");
INSERT INTO contents VALUES("8","Contact Us","Contact Us","<p>Contact Us&nbsp;- Coming Soon</p>","Contact Us","Contact Us","","index,follow","0","contactus.htm","active","2015-06-07 09:28:27","2014-11-10 07:40:41","0","","0");
INSERT INTO contents VALUES("9","Site is Down For Maintenance","Site is Down For Maintenance","<p>Site is Down For Maintenance. We\'ll be back soon.</p>","Site is Down For Maintenance","Site is Down For Maintenance","","index,follow","0","offline.htm","active","2015-06-07 05:20:21","2015-06-07 05:20:21","0","","0");





CREATE TABLE `optiondata` (
  `OptionId` int(8) NOT NULL AUTO_INCREMENT,
  `OptionType` int(4) NOT NULL,
  `OptionName` varchar(150) COLLATE utf8_unicode_ci NOT NULL,
  `OptionDesc` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`OptionId`)
) ENGINE=MyISAM AUTO_INCREMENT=100 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;






CREATE TABLE `site_ads` (
  `ads_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `ads_type` varchar(50) NOT NULL,
  `ads_title` varchar(150) NOT NULL,
  `ads_embed_code` text NOT NULL,
  PRIMARY KEY (`ads_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

INSERT INTO site_ads VALUES("1","main_header","Main Header Long Ad","");
INSERT INTO site_ads VALUES("2","main_footer","Main Footer Long Ad","");
INSERT INTO site_ads VALUES("3","right_top","Right Panel Top Small Ad","");
INSERT INTO site_ads VALUES("4","right_bottom","Right Panel Bottom Small Ad","");





CREATE TABLE `typedata` (
  `TypeId` int(8) NOT NULL AUTO_INCREMENT,
  `TypeFieldName` varchar(50) COLLATE utf8_unicode_ci NOT NULL,
  `TypeDesc` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`TypeId`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;






CREATE TABLE `users` (
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO users VALUES("1","admin","nGMxe/VCqcKxgMTVFMQSFO0IUevB9JHi22JFtvtl/H8=","admin","","2013-11-08 14:29:12","","1","Ibuild Soft","0");





CREATE TABLE `videos` (
  `video_id` bigint(20) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text NOT NULL,
  `tags` varchar(255) NOT NULL,
  `category` int(4) NOT NULL,
  `video_embed_code` text NOT NULL,
  `ads_embed_code` text NOT NULL,
  `status` varchar(10) NOT NULL,
  `featured` varchar(10) NOT NULL,
  `datetime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `seo_title` varchar(150) NOT NULL,
  `seo_keywords` varchar(255) NOT NULL,
  `seo_description` varchar(255) NOT NULL,
  `views` bigint(8) NOT NULL,
  `server` varchar(15) NOT NULL,
  `thumb_url` varchar(150) NOT NULL,
  PRIMARY KEY (`video_id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=latin1;

INSERT INTO videos VALUES("1","Aamir Liaqut is Threatening ARY News and Gone Mad","<p>Aamir Liaqut is Threatening ARY News and Gone Mad</p>","Aamir Liaqut, ARY News","8","<iframe frameborder=\"0\" width=\"560\" height=\"315\" src=\"//www.dailymotion.com/embed/video/x2s6fzg\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2s6fzg_aamir-liaqut-is-threatening-ary-news-and-gone-mad_news\" target=\"_blank\">Aamir Liaqut is Threatening ARY News and Gone Mad</a> <i>by <a href=\"https://www.dailymotion.com/ali-baba-technocraft\" target=\"_blank\">ali-baba-technocraft</a></i>","","active","normal","2015-06-06 21:20:36","Aamir Liaqut is Threatening ARY News","","","12","dailymotion","http://s2.dmcdn.net/K8tFT/x480-9D6.jpg");
INSERT INTO videos VALUES("2","How Agent of RAW Haseena Wajid Speaking Against Burma Muslims","<p>How Agent of RAW Haseena Wajid Speaking Against Burma Muslims</p>","RAW, Haseena Wajid","8","<iframe frameborder=\"0\" width=\"560\" height=\"315\" src=\"//www.dailymotion.com/embed/video/x2s611u\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2s611u_how-agent-of-raw-haseena-wajid-speaking-against-burma-muslims_news\" target=\"_blank\">How Agent of RAW Haseena Wajid Speaking Against...</a> <i>by <a href=\"https://www.dailymotion.com/ali-baba-technocraft\" target=\"_blank\">ali-baba-technocraft</a></i>","","active","normal","2015-06-07 08:15:21","How Agent of RAW Haseena Wajid Speaking Against Burma Muslims","","","0","dailymotion","http://s2.dmcdn.net/K8lPX/x480-6mV.jpg");
INSERT INTO videos VALUES("3","Geo TV News","<p>Geo TV News</p>","","8","<iframe frameborder=\"0\" width=\"560\" height=\"315\" src=\"//www.dailymotion.com/embed/video/xx1ey2\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/xx1ey2_geo-headline_news\" target=\"_blank\">Geo Headline</a> <i>by <a href=\"https://www.dailymotion.com/GeoNews\" target=\"_blank\">GeoNews</a></i>","","active","normal","2015-06-07 08:17:40","Geo TV","","","1","dailymotion","http://s2.dmcdn.net/BhoEc/x480-fM6.jpg");
INSERT INTO videos VALUES("4","Atif Aslam New Song Ab Ajaao 2015","<p>Atif Aslam New Song Ab Ajaao 2015</p>","Atif Aslam, 2015","7","<iframe frameborder=\"0\" width=\"560\" height=\"315\" src=\"//www.dailymotion.com/embed/video/x2eapeu\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2eapeu_atif-aslam-new-song-ab-ajaao-2015_music\" target=\"_blank\">Atif Aslam New Song Ab Ajaao 2015</a> <i>by <a href=\"https://www.dailymotion.com/megaman2213\" target=\"_blank\">megaman2213</a></i>","","active","normal","2015-06-07 10:28:51","Atif Aslam New Song Ab Ajaao 2015","","","0","dailymotion","http://s2.dmcdn.net/IgFSn/x480-EQK.jpg");
INSERT INTO videos VALUES("5","Atif Aslam singing Pehli Nazaar and Sajna Tere Bina In SurKshetra","<p>Atif Aslam singing Pehli Nazaar and Sajna Tere Bina In SurKshetra</p>","Atif Aslam, Pehli Nazaar","7","<iframe frameborder=\"0\" width=\"560\" height=\"315\" src=\"//www.dailymotion.com/embed/video/x10tlwk\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x10tlwk_atif-aslam-singing-pehli-nazaar-and-sajna-tere-bina-in-surkshetra_music\" target=\"_blank\">Atif Aslam singing Pehli Nazaar and Sajna Tere...</a> <i>by <a href=\"https://www.dailymotion.com/priyaadeez\" target=\"_blank\">priyaadeez</a></i>","","active","normal","2015-06-07 20:13:54","Atif Aslam singing Pehli Nazaar and Sajna Tere Bina In SurKshetra","","","1","dailymotion","http://s2.dmcdn.net/Bml56/x480-si8.jpg");
INSERT INTO videos VALUES("6","O Saathi re Tere Bina bhi kaya jina Atif Aslam Himesh Reshammiya and Asha Bhosle","<p>O Saathi re Tere Bina bhi kaya jina Atif Aslam,Himesh Reshammiya and Asha Bhosle</p>","Atif Aslam, Himesh Reshammiya","7","<iframe frameborder=\"0\" width=\"560\" height=\"315\" src=\"//www.dailymotion.com/embed/video/x11dfuw\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x11dfuw_o-saathi-re-tere-bina-bhi-kaya-jina-atif-aslam-himesh-reshammiya-and-asha-bhosle_music\" target=\"_blank\">O Saathi re Tere Bina bhi kaya jina Atif Aslam...</a> <i>by <a href=\"https://www.dailymotion.com/priyaadeez\" target=\"_blank\">priyaadeez</a></i>","","active","normal","2015-06-07 20:23:01","O Saathi re Tere Bina bhi kaya jina Atif Aslam,Himesh Reshammiya and Asha Bhosle","","","0","dailymotion","http://s1.dmcdn.net/BsIZG/x480-1m3.jpg");
INSERT INTO videos VALUES("7","LAMBI JUDAAI - Atif with Reshma Ji in LSA08","<p>LAMBI JUDAAI - Atif with Reshma Ji in LSA\'08</p>","LAMBI JUDAAI, Atif Aslam","7","<iframe frameborder=\"0\" width=\"560\" height=\"315\" src=\"//www.dailymotion.com/embed/video/x1b9a87\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x1b9a87_lambi-judaai-atif-with-reshma-ji-in-lsa-08_music\" target=\"_blank\">LAMBI JUDAAI--- Atif with Reshma Ji in LSA&#039;08</a> <i>by <a href=\"https://www.dailymotion.com/priyaadeez\" target=\"_blank\">priyaadeez</a></i>","","active","normal","2015-06-07 20:25:49","LAMBI JUDAAI--- Atif with Reshma Ji in LSA\'08","","","2","dailymotion","http://s1.dmcdn.net/DheRH/x480-jgN.jpg");
INSERT INTO videos VALUES("8","Naya Pakistan -07 Jun 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t2ubd\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t2ubd_naya-pakistan-07-jun-2015_news\" target=\"_blank\">Naya Pakistan -07 Jun 2015</a> <i>by <a href=\"https://www.dailymotion.com/GeoNews\" target=\"_blank\">GeoNews</a></i>","","active","feature","2015-06-07 23:52:38","Naya Pakistan -07 Jun 2015","","","1","dailymotion","http://s1.dmcdn.net/LHJ7o/x480-6j-.jpg");
INSERT INTO videos VALUES("10","Aatma","","","6","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2lgs62\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2lgs62_new-hindi-movies-2015-aatma-2015-bollywood-movies-2015-best-hindi-comedy-movies_shortfilms\" target=\"_blank\">New Hindi Movies 2015 - Aatma 2015 - Bollywood...</a> <i>by <a href=\"https://www.dailymotion.com/IndianMovies1\" target=\"_blank\">IndianMovies1</a></i>","","active","","2015-06-08 00:15:00","Aatma","","","1","dailymotion","http://s2.dmcdn.net/JoXof/x480-pJ2.jpg");
INSERT INTO videos VALUES("11","The Reham Khan Show (Samina Baig is First Pakistani Woman to Scale Mount Everest along her brother Mirza Ali) – 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t2o89\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t2o89_the-reham-khan-show-samina-baig-is-first-pakistani-woman-to-scale-mount-everest-along-her-brother-mi_news\" target=\"_blank\">The Reham Khan Show (Samina Baig is First...</a> <i>by <a href=\"https://www.dailymotion.com/PakistantvTV\" target=\"_blank\">PakistantvTV</a></i>","","active","feature","2015-06-08 00:25:09","The Reham Khan Show (Samina Baig is First Pakistani Woman to Scale Mount Everest along her brother Mirza Ali) – 7th June 2015","","","0","dailymotion","http://s2.dmcdn.net/LG7t6/x480-NkI.jpg");
INSERT INTO videos VALUES("12","Khabar Naak on Geo News (7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t2oj3\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t2oj3_khabar-naak-on-geo-news-7th-june-2015_news\" target=\"_blank\">Khabar Naak on Geo News (7th June 2015)</a> <i>by <a href=\"https://www.dailymotion.com/PakistantvTV\" target=\"_blank\">PakistantvTV</a></i>","","active","feature","2015-06-08 00:27:40","Khabar Naak on Geo News (7th June 2015","","","0","dailymotion","http://s2.dmcdn.net/LG7TT/x480-eIt.jpg");
INSERT INTO videos VALUES("13","Hasb e Haal – 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t2oit\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t2oit_hasb-e-haal-7th-june-2015_news\" target=\"_blank\">Hasb e Haal &ndash; 7th June 2015</a> <i>by <a href=\"https://www.dailymotion.com/PakistantvTV\" target=\"_blank\">PakistantvTV</a></i>","","active","feature","2015-06-08 00:37:49","Hasb e Haal – 7th June 2015","","","0","dailymotion","http://s2.dmcdn.net/LG61a/x480-Zeq.jpg");
INSERT INTO videos VALUES("14","Aapas ki Baat – 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t2c96\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t2c96_aapas-ki-baat-7th-june-2015_news\" target=\"_blank\">Aapas ki Baat &ndash; 7th June 2015</a> <i>by <a href=\"https://www.dailymotion.com/shunaidqureshi149\" target=\"_blank\">shunaidqureshi149</a></i>","","active","feature","2015-06-08 00:48:09","Aapas ki Baat – 7th June 2015","","","0","dailymotion","http://s2.dmcdn.net/LG2Rl/x480-YjP.jpg");
INSERT INTO videos VALUES("15","News Beat - 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t2ea0\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t2ea0_news-beat-7th-june-2015_news\" target=\"_blank\">News Beat - 7th June 2015</a> <i>by <a href=\"https://www.dailymotion.com/awazpolitics07\" target=\"_blank\">awazpolitics07</a></i>","","active","feature","2015-06-08 00:52:19","News Beat - 7th June 2015","","","0","dailymotion","http://s2.dmcdn.net/LG23S/x480-hd5.jpg");
INSERT INTO videos VALUES("16","Sawal Yeh Hai - 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t2e8n\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t2e8n_sawal-yeh-hai-7th-june-2015_news\" target=\"_blank\">Sawal Yeh Hai - 7th June 2015</a> <i>by <a href=\"https://www.dailymotion.com/awazpolitics07\" target=\"_blank\">awazpolitics07</a></i>","","active","feature","2015-06-08 00:56:43","Sawal Yeh Hai - 7th June 2015","","","0","dailymotion","http://s1.dmcdn.net/LG261/x480-gDh.jpg");
INSERT INTO videos VALUES("17","Aaj Rana Mubashir Kay Sath - 7th June 2015 - Nabil Gabol Exclusive Interview..","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t2e8o\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t2e8o_aaj-rana-mubashir-kay-sath-nabil-gabol-exclusive-interview-7th-june-2015_news\" target=\"_blank\">Aaj Rana Mubashir Kay Sath (Nabil Gabol...</a> <i>by <a href=\"https://www.dailymotion.com/PakistantvTV\" target=\"_blank\">PakistantvTV</a></i>","","active","feature","2015-06-08 00:59:46","Aaj Rana Mubashir Kay Sath - 7th June 2015 - Nabil Gabol Exclusive Interview..","","","0","dailymotion","http://s2.dmcdn.net/LG2U9/x480-LGe.jpg");
INSERT INTO videos VALUES("18","Live With Dr. Shahid Masood - 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t1x1c\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t1x1c_live-with-dr-shahid-masood-7th-june-2015_news\" target=\"_blank\">Live With Dr. Shahid Masood &ndash; 7th June 2015</a> <i>by <a href=\"https://www.dailymotion.com/faizakhan_1122\" target=\"_blank\">faizakhan_1122</a></i>","","active","feature","2015-06-08 01:11:50","Live With Dr. Shahid Masood - 7th June 2015","","","0","dailymotion","http://s1.dmcdn.net/LGuBZ/x480-fAa.jpg");
INSERT INTO videos VALUES("19","Boond Boond HD Full Video Song Roy (2015) Official | Arjun Rampal  Jacqueline Fernandez | Latest & New Indian Songs","","","7","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2esjer\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2esjer_boond-boond-hd-full-video-song-roy-2015-official-arjun-rampal-jacqueline-fernandez-latest-new-india_music\" target=\"_blank\">&#039;Boond Boond&#039; HD Full Video Song Roy (2015...</a> <i>by <a href=\"https://www.dailymotion.com/sohailshoukat2704\" target=\"_blank\">sohailshoukat2704</a></i>","","active","","2015-06-08 01:15:06","\'Boond Boond\' HD Full Video Song Roy (2015) Official | Arjun Rampal, Jacqueline Fernandez | Latest & New Indian Songs","","","0","dailymotion","http://s2.dmcdn.net/Ilp4h/x480-w3K.jpg");
INSERT INTO videos VALUES("20","Aao Raja HD Video Song - Yo Yo Honey Singh","","","7","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2mm7a6\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2mm7a6_aao-raja-hd-video-song-yo-yo-honey-singh-gabbar-is-back-2015_music\" target=\"_blank\">Aao Raja HD Video Song - Yo Yo Honey Singh...</a> <i>by <a href=\"https://www.dailymotion.com/bollywoodonlinemusic\" target=\"_blank\">bollywoodonlinemusic</a></i>","","active","","2015-06-08 01:17:06","Aao Raja HD Video Song - Yo Yo Honey Singh","","","0","dailymotion","http://s1.dmcdn.net/J6sqs/x480-Upa.jpg");
INSERT INTO videos VALUES("21","Shakira HD Video Song Welcome To Karachi [2015]","","","7","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2pes0p\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2pes0p_shakira-hd-video-song-welcome-to-karachi-2015_music\" target=\"_blank\">Shakira HD Video Song Welcome To Karachi [2015]</a> <i>by <a href=\"https://www.dailymotion.com/bollywoodonlinemusic\" target=\"_blank\">bollywoodonlinemusic</a></i>","","active","","2015-06-08 01:18:23","Shakira HD Video Song Welcome To Karachi [2015]","","","2","dailymotion","http://s1.dmcdn.net/KakaS/x480-04Q.jpg");
INSERT INTO videos VALUES("22","Bezubaan Phir Se HD Video Song ABCD 2 [2015] - Varun Dhawan - Shraddha Kapoor","","","7","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2pd8jm\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2pd8jm_bezubaan-phir-se-hd-video-song-abcd-2-2015-varun-dhawan-shraddha-kapoor_music\" target=\"_blank\">Bezubaan Phir Se HD Video Song ABCD 2 [2015...</a> <i>by <a href=\"https://www.dailymotion.com/bollywoodonlinemusic\" target=\"_blank\">bollywoodonlinemusic</a></i>","","active","","2015-06-08 01:19:40","Bezubaan Phir Se HD Video Song ABCD 2 [2015] - Varun Dhawan - Shraddha Kapoor","","","0","dailymotion","http://s2.dmcdn.net/KaFay/x480-2Di.jpg");
INSERT INTO videos VALUES("23"," Sunny Leone | Ek Paheli Leela ","","","7","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2hkbp5\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2hkbp5_desi-look-video-song-sunny-leone-ek-paheli-leela-music-dr-zeus_music\" target=\"_blank\">Desi Look Video Song | Sunny Leone | Ek Paheli...</a> <i>by <a href=\"https://www.dailymotion.com/Tseries\" target=\"_blank\">Tseries</a></i>","","active","","2015-06-08 01:21:07"," Sunny Leone | Ek Paheli Leela ","","","0","dailymotion","http://s2.dmcdn.net/JCCBt/x480-n7D.png");
INSERT INTO videos VALUES("24","Chittiyaan Kalaiyaan VIDEO SONG | Roy ","","","7","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2e6d09\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2e6d09_chittiyaan-kalaiyaan-video-song-roy-meet-bros-anjjan-kanika-kapoor-t-series_music\" target=\"_blank\">&#039;Chittiyaan Kalaiyaan&#039; VIDEO SONG | Roy | Meet...</a> <i>by <a href=\"https://www.dailymotion.com/Tseries\" target=\"_blank\">Tseries</a></i>","","active","","2015-06-08 01:22:34","Chittiyaan Kalaiyaan\' VIDEO SONG | Roy ","","","0","dailymotion","http://s1.dmcdn.net/Ie6fL/x480-qXv.jpg");
INSERT INTO videos VALUES("25","  02:17 Daaru Peeke Dance HD Video Song Kuch Kuch Locha Hai [2015] Sunny Leone Daaru Peeke Dance HD Video Song Kuch Kuch Locha Hai [2015] Sunny Leone ","","","7","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2n2lqw\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2n2lqw_sunny-leone-sizzles-in-pani-wala-dance-kuch-kuch-locha-hai-2015-by-bollywood-classic-collection_music\" target=\"_blank\">Sunny Leone Sizzles in Pani Wala Dance-Kuch...</a> <i>by <a href=\"https://www.dailymotion.com/hdvidz\" target=\"_blank\">hdvidz</a></i>","","active","","2015-06-08 01:23:55","  02:17 Daaru Peeke Dance HD Video Song Kuch Kuch Locha Hai [2015] Sunny Leone Daaru Peeke Dance HD Video Song Kuch Kuch Locha Hai [2015] Sunny Leone ","","","0","dailymotion","http://s1.dmcdn.net/J_698/x480-WtT.jpg");
INSERT INTO videos VALUES("26","Shake That Booty - Balwinder Singh Famous Ho Gaya | Mika Singh  Sunny Leone","","","7","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x23ynqs\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x23ynqs_shake-that-booty-balwinder-singh-famous-ho-gaya-mika-singh-sunny-leone-latest-song-2014_music\" target=\"_blank\">Shake That Booty - Balwinder Singh Famous Ho...</a> <i>by <a href=\"https://www.dailymotion.com/TipsMusicFilms\" target=\"_blank\">TipsMusicFilms</a></i>","","active","","2015-06-08 01:26:51","Shake That Booty - Balwinder Singh Famous Ho Gaya | Mika Singh, Sunny Leone","","","0","dailymotion","http://s1.dmcdn.net/GhTuZ/x480-B9Y.jpg");
INSERT INTO videos VALUES("27","Daaru Peeke Dance HD Video Song Kuch Kuch Locha Hai [2015] Sunny Leone","","","6","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2mpz31\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2mpz31_daaru-peeke-dance-hd-video-song-kuch-kuch-locha-hai-2015-sunny-leone_music\" target=\"_blank\">Daaru Peeke Dance HD Video Song Kuch Kuch Locha...</a> <i>by <a href=\"https://www.dailymotion.com/bollywoodonlinemusic\" target=\"_blank\">bollywoodonlinemusic</a></i>","","active","","2015-06-08 01:28:26","Daaru Peeke Dance HD Video Song Kuch Kuch Locha Hai [2015] Sunny Leone","","","0","dailymotion","http://s2.dmcdn.net/J8f4y/x480-9oz.jpg");
INSERT INTO videos VALUES("28","Devil-Yaar Naa Miley | Salman Khan | Yo Yo Honey Singh | Kick","","","7","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x21ciho\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x21ciho_official-devil-yaar-naa-miley-salman-khan-yo-yo-honey-singh-kick_music\" target=\"_blank\">Official: Devil-Yaar Naa Miley | Salman Khan...</a> <i>by <a href=\"https://www.dailymotion.com/Tseries\" target=\"_blank\">Tseries</a></i>","","active","","2015-06-08 01:30:31","Devil-Yaar Naa Miley | Salman Khan | Yo Yo Honey Singh | Kick","","","1","dailymotion","http://s2.dmcdn.net/GG-bb/x480-Hfr.jpg");
INSERT INTO videos VALUES("30","Recipe of Gosht Hari Mirch & Loki Aalu Ka Raita","","","3","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2a63hx\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2a63hx_recipe-of-gosht-hari-mirch-loki-aalu-ka-raita-tarka-rida-aftab-masala-tv-live-pak-news_tv\" target=\"_blank\">Recipe of Gosht Hari Mirch &amp; Loki Aalu Ka Raita...</a> <i>by <a href=\"https://www.dailymotion.com/LivePakNews\" target=\"_blank\">LivePakNews</a></i>","","active","","2015-06-08 01:37:17","Recipe of Gosht Hari Mirch & Loki Aalu Ka Raita","","","0","dailymotion","http://s1.dmcdn.net/HccBg/x480-c0l.jpg");
INSERT INTO videos VALUES("31","pakistani hero Shahid Afridi - 21 Wickets video highlights In World Cup 2011","","","5","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t23zm\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t23zm_pakistani-hero-shahid-afridi-21-wickets-video-highlights-in-world-cup-2011_sport\" target=\"_blank\">pakistani hero Shahid Afridi  - 21 Wickets...</a> <i>by <a href=\"https://www.dailymotion.com/PTVSports\" target=\"_blank\">PTVSports</a></i>","","active","","2015-06-08 01:39:47","pakistani hero Shahid Afridi - 21 Wickets video highlights In World Cup 2011","","","0","dailymotion","http://s1.dmcdn.net/LGzEb/x480-XLW.jpg");
INSERT INTO videos VALUES("32","All Sixes hit by Shahid Afridi in year 2014 By Bilal Shahid","","","5","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2e0fsn\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2e0fsn_all-sixes-hit-by-shahid-afridi-in-year-2014-by-bilal-shahid_news\" target=\"_blank\">All Sixes hit by Shahid Afridi in year 2014 By...</a> <i>by <a href=\"https://www.dailymotion.com/SiaSiat\" target=\"_blank\">SiaSiat</a></i>","","active","","2015-06-08 01:41:23","All Sixes hit by Shahid Afridi in year 2014 By Bilal Shahid","","","0","dailymotion","http://s1.dmcdn.net/Ic0tO/x480-xIt.jpg");
INSERT INTO videos VALUES("33","Pink Panther","","","4","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x15u00j\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x15u00j_pink-panther-cartoon-full-episodes-2013-extremlymtorrents_shortfilms\" target=\"_blank\">Pink Panther - Cartoon Full  Episodes 2013...</a> <i>by <a href=\"https://www.dailymotion.com/extremlymsync\" target=\"_blank\">extremlymsync</a></i>","","active","","2015-06-08 01:44:37","Pink Panther","","","0","dailymotion","http://s1.dmcdn.net/CnKBC/x480-xHk.jpg");
INSERT INTO videos VALUES("34","Tarzan and Jane ","","","4","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2l4bfz\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2l4bfz_tarzan-and-jane-cartoon-for-children-2013-new-movie-full-english-subtitles_shortfilms\" target=\"_blank\">Tarzan and Jane ► Cartoon for Children ► 2013...</a> <i>by <a href=\"https://www.dailymotion.com/shazadimran2\" target=\"_blank\">shazadimran2</a></i>","","active","","2015-06-08 01:47:34","Tarzan and Jane ","","","1","dailymotion","http://s1.dmcdn.net/Jqi7O/x480-Ouj.jpg");
INSERT INTO videos VALUES("35","Kaneez Episode 81 Full","","","1","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t1xn8\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t1xn8_kaneez-episode-81-full_shortfilms\" target=\"_blank\">Kaneez Episode 81 Full</a> <i>by <a href=\"https://www.dailymotion.com/dramasvid14\" target=\"_blank\">dramasvid14</a></i>","","active","","2015-06-08 01:50:41","Kaneez Episode 81 Full","","","0","dailymotion","http://s1.dmcdn.net/LGveb/x480-ckx.jpg");
INSERT INTO videos VALUES("36","Mol Episode 2 Full","","","1","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2sxqn5\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2sxqn5_mol-episode-2-full_shortfilms\" target=\"_blank\">Mol Episode 2 Full</a> <i>by <a href=\"https://www.dailymotion.com/dramasvid14\" target=\"_blank\">dramasvid14</a></i>","","active","","2015-06-08 01:52:26","Mol Episode 2 Full","","","0","dailymotion","http://s1.dmcdn.net/LFVXx/x480-P21.jpg");
INSERT INTO videos VALUES("37","Jugnoo Episode 8 Full","","","1","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2stcjr\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2stcjr_jugnoo-episode-8-full_shortfilms\" target=\"_blank\">Jugnoo Episode 8 Full</a> <i>by <a href=\"https://www.dailymotion.com/dramasvid12\" target=\"_blank\">dramasvid12</a></i>","","active","","2015-06-08 01:53:51","Jugnoo Episode 8 Full","","","0","dailymotion","http://s1.dmcdn.net/LECFV/x480-42e.jpg");
INSERT INTO videos VALUES("38","Mera Naam Yousuf Hai Episode 14 Full","","","1","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2sttnm\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2sttnm_mera-naam-yousuf-hai-episode-14-full_shortfilms\" target=\"_blank\">Mera Naam Yousuf Hai Episode 14 Full</a> <i>by <a href=\"https://www.dailymotion.com/dramasvid25\" target=\"_blank\">dramasvid25</a></i>","","active","","2015-06-08 01:54:50","Mera Naam Yousuf Hai Episode 14 Full","","","0","dailymotion","http://s1.dmcdn.net/LEJcM/x480-dVO.jpg");
INSERT INTO videos VALUES("39","Dil Ka Kya Rung Karun Episode 14 Full","","","1","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2stlvn\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2stlvn_dil-ka-kya-rung-karun-episode-14-full_shortfilms\" target=\"_blank\">Dil Ka Kya Rung Karun Episode 14 Full</a> <i>by <a href=\"https://www.dailymotion.com/dramasvid13\" target=\"_blank\">dramasvid13</a></i>","","active","","2015-06-08 01:56:13","Dil Ka Kya Rung Karun Episode 14 Full","","","0","dailymotion","http://s2.dmcdn.net/LEDJN/x480-HqO.jpg");
INSERT INTO videos VALUES("40","Power Play - 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t1x8j\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t1x8j_power-play-7th-june-2015_news\" target=\"_blank\">Power Play  &ndash; 7th June 2015</a> <i>by <a href=\"https://www.dailymotion.com/an71960\" target=\"_blank\">an71960</a></i>","","active","feature","2015-06-08 02:01:09","Power Play - 7th June 2015","","","1","dailymotion","http://s1.dmcdn.net/LGt5w/x480-kwB.jpg");
INSERT INTO videos VALUES("41","Mere Mutabiq with Hassan Nisar – 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t1qqb\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t1qqb_mere-mutabiq-with-hassan-nisar-7th-june-2015_news\" target=\"_blank\">Mere Mutabiq with Hassan Nisar &ndash; 7th June 2015</a> <i>by <a href=\"https://www.dailymotion.com/hamza-shaikh2\" target=\"_blank\">hamza-shaikh2</a></i>","","active","feature","2015-06-08 02:05:26","Mere Mutabiq with Hassan Nisar – 7th June 2015","","","0","dailymotion","http://s1.dmcdn.net/LGpcs/x480-37D.jpg");
INSERT INTO videos VALUES("42","  Halwa puri حلوہ پوری اور چنے","","","3","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2kffx4\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2kffx4_halwa-puri-recipe-by-zubaida-tariq_lifestyle\" target=\"_blank\">Halwa puri recipe by Zubaida Tariq</a> <i>by <a href=\"https://www.dailymotion.com/myweb12\" target=\"_blank\">myweb12</a></i>","","active","","2015-06-08 02:15:44","  Halwa puri حلوہ پوری اور چنے","","","0","dailymotion","http://s2.dmcdn.net/JjrLB/x480-JHY.jpg");
INSERT INTO videos VALUES("43","Galawat Kay Kabab & Nihari","","","3","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x273ctd\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x273ctd_galawat-kay-kabab-nihari-part-1-zubaida-tariq-handi-livepaknews-com_tv\" target=\"_blank\">Galawat Kay Kabab &amp; Nihari  Part 1 | Zubaida...</a> <i>by <a href=\"https://www.dailymotion.com/LivePakNews\" target=\"_blank\">LivePakNews</a></i>","","active","","2015-06-08 02:20:06","Galawat Kay Kabab & Nihari","","","0","dailymotion","http://s1.dmcdn.net/HYAkb/x480-4LP.jpg");
INSERT INTO videos VALUES("44","Spot Light - 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t1wx2\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t1wx2_spot-light-7th-june-2015_news\" target=\"_blank\">Spot Light  &ndash; 7th June 2015</a> <i>by <a href=\"https://www.dailymotion.com/faizakhan_1122\" target=\"_blank\">faizakhan_1122</a></i>","","active","feature","2015-06-08 02:26:51","Spot Light - 7th June 2015","","","0","dailymotion","http://s1.dmcdn.net/LGt85/x480-Kfp.jpg");
INSERT INTO videos VALUES("45","Ikhtalafi Note - 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t1x0h\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t1x0h_ikhtalafi-note-7th-june-2015_news\" target=\"_blank\">Ikhtalafi Note &ndash; 7th June 2015</a> <i>by <a href=\"https://www.dailymotion.com/an71977\" target=\"_blank\">an71977</a></i>","","active","feature","2015-06-08 02:30:47","Ikhtalafi Note - 7th June 2015","","","0","dailymotion","http://s2.dmcdn.net/LGt3v/x480-uCv.jpg");
INSERT INTO videos VALUES("46","Situation Room - 7th June 2015","","","8","<iframe frameborder=\"0\" width=\"480\" height=\"270\" src=\"//www.dailymotion.com/embed/video/x2t20xt\" allowfullscreen></iframe><br /><a href=\"https://www.dailymotion.com/video/x2t20xt_situation-room-7th-june-2015_news\" target=\"_blank\">Situation Room - 7th June 2015</a> <i>by <a href=\"https://www.dailymotion.com/maliksahab94\" target=\"_blank\">maliksahab94</a></i>","","active","feature","2015-06-08 02:40:14","Situation Room - 7th June 2015","","","0","dailymotion","http://s1.dmcdn.net/LGwiN/x480-kjV.jpg");



