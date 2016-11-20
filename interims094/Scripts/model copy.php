<?php
$debug = false;
$debugXML = false;

// the text return for the script
$output = '';


$sXMLHeader = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';

$aXMLRespTypes = Array(
'getseed' => 
'<getseed>
	<error>%s</error>
	<id>%s</id> 
	<seed>%s</seed>
 </getseed>',
 
 'getlogin' =>
 '<getlogin>
 	<error>%s</error>
 	<name>%s</name>
 	<schoolDistrictID>%s</schoolDistrictID>
 	<authlevel>%s</authlevel>
 	<lastlogin>%s</lastlogin>
 	<message>%s</message>
 	<completed>%s</completed>
 	<total>%s</total>
  </getlogin>',
  
  'getclasses' =>
  '<getclasses>
 		<error>%s</error>
 		%s
   </getclasses>',
   
   'getallstudents' =>
   
   '<getallstudents>
	   	<error>%s</error>
   		%s
   </getallstudents>',
   
   'getstudentnames' =>
   
	 '<getstudentnames>
	   	<error>%s</error>
   		%s
   	</getstudentnames>',
   
   'getstudent' =>
   
   '<getstudent>
	   	<error>%s</error>
   		%s
   </getstudent>',

'writeback' =>

'<writeback>
	<error>%s</error>
	<number>%s</number>
	<idnum>%s</idnum>
 </writeback>',
 
 'getdefaults' =>
 
 '<getdefaults>
	<error>%s</error>
	%s
	</getdefaults>',
	
'getcodes' =>
'<getcodes>
	<error>%s</error>
	%s
</getcodes>',

'getallrecords' =>
'<records>
	<error>%s</error>
	%s
</records>',
);

$sXMLDefaultTemplates = Array(
	'sXMLcourseTemplate' =>
	'<course><courseid>%s</courseid><coursetitle>%s</coursetitle></course>',
	
	'sXMLstudentTemplate' =>
	'<student><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname><out>%s</out><sat>%s</sat><unsat>%s</unsat><failing>%s</failing><comments>%s</comments><modified>%s</modified><modifiedby>%s</modifiedby><codes>%s</codes></student>',
	
	'sXMLstudentNameTemplate' => 
	'<student><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname><modified>%s</modified></student>',

	'sXMLdefaultTemplate' => 
	'<default><key>%s</key><value>%s</value></default>',

	'sXMLcodeTemplate'	=> 
	'<code><codeid>%s</codeid><text>%s</text><order>%s</order></code>',

	'sXMLrecordTemplate' => 
	'<record><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname>%s',
	
	'sXMLcourseRecordTemplate' => 
	'<courserecord><coursetitle>%s</coursetitle><teacher>%s</teacher><sat>%s</sat><unsat>%s</unsat><failing>%s</failing><comments>%s</comments><modified>%s</modified></courserecord>'
);

$sXMLDefaultTemplates = Array(
	'sXMLcourseTemplate' =>
	'<course><courseid>%s</courseid><coursetitle>%s</coursetitle></course>',
	
	'sXMLstudentTemplate' =>
	'<student><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname><out>%s</out><sat>%s</sat><unsat>%s</unsat><failing>%s</failing><comments>%s</comments><modified>%s</modified><modifiedby>%s</modifiedby><codes>%s</codes></student>',
	
	'sXMLstudentNameTemplate' => 
	'<student><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname><modified>%s</modified></student>',

	'sXMLdefaultTemplate' => 
	'<default><key>%s</key><value>%s</value></default>',

	'sXMLcodeTemplate'	=> 
	'<code><codeid>%s</codeid><text>%s</text><order>%s</order></code>',

	'sXMLrecordTemplate' => 
	'<record><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname>%s',
	
	'sXMLcourseRecordTemplate' => 
	'<courserecord><coursetitle>%s</coursetitle><teacher>%s</teacher><sat>%s</sat><unsat>%s</unsat><failing>%s</failing><comments>%s</comments><modified>%s</modified></courserecord>'
);

?>