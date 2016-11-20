<?php

/*
	queryresponder.php
	Version:  2006-07-12-2142
	
	Changelog:
	
	+ added JSON support to login
*/



//error_reporting(E_ALL);
require_once("model.php");
require_once("actions.php");
	
if ($debug) echo 'queryresponder.php :: l.6' . '<br />';

$mysql = mysql_connect('localhost', 'root', 'tabasco');
mysql_select_db('interims', $mysql);

if ($_GET['task']) {
	$reqtype = $_GET['task'];
} else {
	$reqtype = $_POST['task'];
}
if ($debug) echo 'queryresponder.php :: l.14' . '<br />';

switch ($reqtype) {

	case 'getseed':
		if ($debug) echo 'queryresponder.php :: l.19' . '<br />';
		$output = getseed();
		break;
	case 'getlogin':
		$output = getlogin();
		break;
	case 'getloginInsecure':
		$output = getloginInsecure();
		break;
	case 'getclasses':
		$output = getclasses();		
		break;
	 case 'getallstudents': 
 	 	$output = getallstudents();
 		break; 
 	case 'writeback': 
  		$output = writeback();
 		break; 
	case 'getdefaults':
		$output = getdefaults();
		break;
	case 'getcodes':
		$output = getcodes();
		break;
	case 'getstudentnames':
		$output = getstudentnames();
		break;
	case 'getstudent':
		$output = getstudent();
		break;
} // end switch

if (!empty($output))
{
	header("HTTP/1.1 200 OK");
    header("Content-type: text/json");
    echo $output;
}
else
{
    // no output means error
    // Send http status code. this is important because the javascript checks 
    // the http status code to determine whether to act on the response.
    header("HTTP/1.1 400 Bad Request");
} // end if

?>