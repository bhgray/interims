<?php

$debug = false;
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

$sXMLcourseTemplate = '<course><courseid>%s</courseid><coursetitle>%s</coursetitle></course>';
$sXMLstudentTemplate = '<student><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname><out>%s</out><sat>%s</sat><unsat>%s</unsat><failing>%s</failing><comments>%s</comments><modified>%s</modified><modifiedby>%s</modifiedby><codes>%s</codes></student>';
$sXMLstudentNameTemplate = '<student><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname></student>';
$sXMLdefaultTemplate = '<default><key>%s</key><value>%s</value></default>';
$sXMLcodeTemplate = '<code><codeid>%s</codeid><text>%s</text><order>%s</order></code>';
$sXMLrecordTemplate ='<record><studentid>%s</studentid><firstname>%s</firstname><lastname>%s</lastname>%s';
$sXMLcourseRecordTemplate = '<courserecord><coursetitle>%s</coursetitle><teacher>%s</teacher><sat>%s</sat><unsat>%s</unsat><failing>%s</failing><comments>%s</comments><modified>%s</modified></courserecord>';

// the text return for the script
$output = '';

$mysql = mysql_connect('localhost', 'root', 'tabasco');
mysql_select_db('interims', $mysql);

if ($_GET['task']) {
	$reqtype = $_GET['task'];
} else {
	$reqtype = $_POST['task'];
}

switch ($reqtype) {

	case 'getseed':

		
		mysql_query('INSERT INTO int_seeds VALUES()');
		$result = mysql_query('SELECT id, seed FROM int_seeds');
		$error = '';

		if (!$result) {
			$error = mysql_error();
		} else {
			$error = '';
		}

		$row = mysql_fetch_assoc($result);
		// avoid putting NULL into the variables
		if ($row['id']) {
			$id = $row['id'];
		} else {
			$id = '';
		}
		
		if ($row['seed']) {
			$seed = $row['seed'];
		} else {
			$seed = '';
		}

		$output = sprintf($aXMLRespTypes['getseed'], $error, $id, $seed);
		break;

	case 'getlogin':

		if ($_GET['username']) {
			$username = $_GET['username'];
		} else {
			$username = $_POST['username'];
		}
		
		if ($_GET['id']) {
			$id = $_GET['id'];
		} else {
			$id = $_POST['id'];
		}
		
		if ($_GET['hash']) {
			$hash = $_GET['hash'];
		} else {
			$hash = $_POST['hash'];
		}

		$sql = 'SELECT * FROM int_teachers WHERE username = \'' . mysql_real_escape_string($username) . '\'';
		$result = mysql_query($sql);
		$error = '';

		if (!$result) {
			$error = mysql_error();				
		} else {
			$error = '';
		}

		
		$user_row = mysql_fetch_assoc($result);
		if (!$user_row) {
			$error = 'Bad username/password combination';
		}
		$sql = 'SELECT * FROM int_seeds WHERE id=' . (int)$id;
		$result = mysql_query($sql);
				// fetch the seed (the only one in the db)
		$seed_row = mysql_fetch_assoc($result);

		if (!$seed_row) {
			$error = 'Hacking attempt; login failed';
		}
		
		if ( (md5(md5($user_row['password']) . $seed_row['seed']) == $hash) ) {
			// success!  the user has logged in
			$name = $user_row['firstName'] . ' ' . $user_row['lastName'];
			$sdid = $user_row['schoolDistrictID'];
			$auth = $user_row['auth_level'];
			
			$lastlogin = $user_row['last_login'];
			if ($lastlogin == NULL) {
				$lastlogin = '0';
			}

			$message = $user_row['message'];
			if ($message == NULL) {
				$message = ' ';
			}
			$sql = 'SELECT COUNT(*) AS \'complete\' FROM `int_courses`, `int_rosters` WHERE int_courses.courseID = int_rosters.courseID AND int_courses.teacherID = \'' . $user_row['schoolDistrictID'] . '\' AND int_rosters.modified <> 0';
			$result = mysql_query($sql);
			if ($result) {
				$row = mysql_fetch_assoc($result);
				$completedcount = $row['complete'];
			} else {
				$completedcount = '0';
			}
			$sql = 'SELECT COUNT(*)  AS \'total\' FROM `int_courses`, `int_rosters` WHERE int_courses.courseID = int_rosters.courseID AND int_courses.teacherID = \'' . $user_row['schoolDistrictID'] . '\'';
			$result = mysql_query($sql);			
			if ($result) {
				$row = mysql_fetch_assoc($result);
				$totalcount = $row['total'];
			} else {
				$totalcount = '0';
			}
			// now that we are logged in, delete the seed
			$sql = 'DELETE FROM `int_seeds` WHERE id=' . (int)$id;
			mysql_query($sql);
			
			// register this successful login as the last_login for next time!
			$sql = 'UPDATE `int_teachers` SET `last_login` = UNIX_TIMESTAMP(NOW()) WHERE `schoolDistrictID` = \'' . $user_row['schoolDistrictID'] . '\'';
			$result = mysql_query($sql);			
		} else {
			$error = $error . 'Invalid username/password combination';
			$name = '';
			$sdid = '';
			$auth = '';
			$lastlogin = '';
			$message = '';
			$completedcount = '';
			$totalcount = '';			
		}
		$output = sprintf($aXMLRespTypes['getlogin'], $error, $name, $sdid, $auth, $lastlogin, $message, $completedcount, $totalcount);
		break;
	case 'getclasses':

		if ($_GET['teacherid']) {
			$tid = $_GET['teacherid'];
		} else {
			$tid = $_POST['teacherid'];
		}

		$sql = 'SELECT * FROM int_courses WHERE teacherID = \'' . mysql_real_escape_string($tid) . '\'';
		$result = mysql_query($sql);
		$error = '';
		if (!$result) {
			$error = mysql_error();				
		} else {
			$error = '';
		}

		$coursesstring = '';
		while ($course_row = mysql_fetch_assoc($result)) {
			$coursesstring = $coursesstring . sprintf($sXMLcourseTemplate, $course_row['courseID'], $course_row['title']);
		}
		$output = sprintf($aXMLRespTypes['getclasses'], $error, $coursesstring);
		break;
	/* case 'getallstudents': */
/* 	 */
/* 		if ($_GET['courseid']) { */
/* 			$cid = $_GET['courseid']; */
/* 		} else { */
/* 			$cid = $_POST['courseid']; */
/* 		} */
/* 		$sql = sprintf("SELECT * from `int_rosters`, `int_students` WHERE int_rosters.courseID = '%s' AND int_rosters.studentID = int_students.studentID ORDER BY int_students.lastName, int_students.firstName", mysql_real_escape_string($cid)); */
/* 		$result = mysql_query($sql); */
/* 		$error = ''; */
/* 		if (!$result) { */
/* 			$error = mysql_error();				 */
/* 		} else { */
/* 			$error = ''; */
/* 		} */
/*  */
/* 		$studentsstring = ''; */
/* 		while ($student_row = mysql_fetch_assoc($result)) { */
/* 			$firstname = $student_row['firstName']; */
/* 			$lastname = $student_row['lastName']; */
/* 			$studentid = $student_row['studentID']; */
/* 			$out = $student_row['outstanding']; */
/* 			if ($out == NULL) { */
/* 					$out = '0'; */
/* 				} */
/* 			$sat = $student_row['satisfactory']; */
/* 			if ($sat == NULL) { */
/* 					$sat = '0'; */
/* 				} */
/* 			$unsat = $student_row['unsatisfactory']; */
/* 			if ($unsat == NULL) { */
/* 					$unsat = '0'; */
/* 				} */
/* 			$fail = $student_row['failing']; */
/* 			if ($fail == NULL) { */
/* 					$fail = '0'; */
/* 				} */
/* 			$comm = $student_row['comments']; */
/* 			if ($comm == NULL) { */
/* 					$comm = ' '; */
/* 				} */
/* 			$mod = $student_row['modified']; */
/* 			if ($mod == NULL) { */
/* 					$mod = ' '; */
/* 				} */
/* 			$modby = $student_row['modified_by']; */
/* 			if ($modby == NULL) { */
/* 					$modby = ' '; */
/* 			} */
/* 			$codes = $student_row['codes']; */
/* 			if ($codes == NULL) { */
/* 					$codes = ' '; */
/* 			} */
/* 			$studentsstring = $studentsstring . sprintf($sXMLstudentTemplate, $studentid, $firstname, $lastname, $out, $sat, $unsat, $fail, $comm, $mod, $modby, $codes); */
/* 		} */
/* 		$output = sprintf($aXMLRespTypes['getallstudents'], $error, $studentsstring); */
/* 		break; */
/* 	case 'writeback': */
/*  */
/* 		if ($_GET['out']) { */
/* 			$out = $_GET['out']; */
/* 		} else { */
/* 			$out = $_POST['out']; */
/* 		} */
/*  */
/* 		if ($_GET['sat']) { */
/* 			$sat = $_GET['sat']; */
/* 		} else { */
/* 			$sat = $_POST['sat']; */
/* 		} */
/* 			 */
/* 		if ($_GET['unsat']) { */
/* 			$unsat = $_GET['unsat']; */
/* 		} else { */
/* 			$unsat = $_POST['unsat']; */
/* 		} */
/*  */
/* 		if ($_GET['fail']) { */
/* 			$fail = $_GET['fail']; */
/* 		} else { */
/* 			$fail = $_POST['fail']; */
/* 		} */
/*  */
/* 		if ($_GET['comments']) { */
/* 			$comments = $_GET['comments']; */
/* 		} else { */
/* 			$comments = $_POST['comments']; */
/* 		} */
/*  */
/* 		if ($_GET['teacherid']) { */
/* 			$teacherid = $_GET['teacherid']; */
/* 		} else { */
/* 			$teacherid = $_POST['teacherid']; */
/* 		} */
/* 		 */
/* 		if ($_GET['codes']) { */
/* 			$codes = $_GET['codes']; */
/* 		} else { */
/* 			$codes = $_POST['codes']; */
/* 		} */
/*  */
/* 		if ($_GET['courseid']) { */
/* 			$courseid = $_GET['courseid']; */
/* 		} else { */
/* 			$courseid = $_POST['courseid']; */
/* 		} */
/* 		 */
/* 		if ($_GET['studentid']) { */
/* 			$studentid = $_GET['studentid']; */
/* 		} else { */
/* 			$studentid = $_POST['studentid']; */
/* 		} */
/*  */
/* 			$sql = sprintf("UPDATE `int_rosters` SET `outstanding` = '%s', `satisfactory` = '%s', `unsatisfactory` = '%s', `failing` = '%s', `comments` = '%s', `modified` = UNIX_TIMESTAMP(NOW()), `modified_by` = '%s', `codes` = '%s' WHERE `courseID` = '%s' AND `studentID` LIKE '%s' LIMIT 1",  */
/* 						mysql_real_escape_string($out), mysql_real_escape_string($sat), mysql_real_escape_string($unsat), mysql_real_escape_string($fail), mysql_real_escape_string($comments), mysql_real_escape_string($teacherid), mysql_real_escape_string($codes), mysql_real_escape_string($courseid), mysql_real_escape_string($studentid)); */
/*  */
/* 		$result = mysql_query($sql); */
/* 		$error = ''; */
/* 		if (!$result) { */
/* 			$error = mysql_error();				 */
/* 		} else { */
/* 			$error = ''; */
/* 		} */
/*  */
/* 		$output = sprintf($aXMLRespTypes['writeback'], $error, mysql_affected_rows(), $studentid); */
/* 		break; */
	case 'getdefaults':
		$sql = "SELECT * from `int_defaults`";
		$result = mysql_query($sql);
		$error = '';
		if (!$result) {
			$error = mysql_error();	
		} else {
			$error = '';
		}

		$defaultsstring = '';
		while ($row = mysql_fetch_assoc($result)) {
			$key = $row['key'];
			$value = $row['value'];
			$defaultsstring = $defaultsstring . sprintf($sXMLdefaultTemplate, $key, $value);
		}
		$output = sprintf($aXMLRespTypes['getdefaults'], $error, $defaultsstring);
		break;
	case 'getcodes':
		$sql = sprintf("SELECT * from `int_codes` ORDER BY displayOrder");
		$result = mysql_query($sql);
		$error = '';
		if (!$result) {
			$error = mysql_error();				
		} else {
			$error = '';
		}

		$codesstring = '';
		while ($row = mysql_fetch_assoc($result)) {
			$code = $row['code'];
			$text = $row['text'];
			$order = $row['displayOrder'];
			$codesstring = $codesstring . sprintf($sXMLcodeTemplate, $code, $text, $order);
		}
		$output = sprintf($aXMLRespTypes['getcodes'], $error, $codesstring);
		break;
	case 'getstudentnames':
		if ($_GET['courseid']) {
			$cid = $_GET['courseid'];
		} else {
			$cid = $_POST['courseid'];
		}
		
		$sql = sprintf("SELECT * from `int_rosters`, `int_students` WHERE int_rosters.courseID = '%s' AND int_rosters.studentID = int_students.studentID ORDER BY int_students.lastName, int_students.firstName", mysql_real_escape_string($cid));
		$result = mysql_query($sql);
		$error = '';
		if (!$result) {
			$error = mysql_error();				
		} else {
			$error = '';
		}
		
		if (mysql_affected_rows() == 0 ) {
			$error = 'no rows for course ' . $cid;	
		}
		
		$studentsstring = '';
		while ($student_row = mysql_fetch_assoc($result)) {
			$firstname = $student_row['firstName'];
			$lastname = $student_row['lastName'];
			$studentid = $student_row['studentID'];
			$studentsstring = $studentsstring . sprintf($sXMLstudentNameTemplate, $studentid, $firstname, $lastname);
		}
		
		$output = sprintf($aXMLRespTypes['getstudentnames'], $error, $studentsstring);
			
		break;
		
	case 'getstudent':
		if ($_GET['courseid']) {
			$cid = $_GET['courseid'];
		} else {
			$cid = $_POST['courseid'];
		}
		if ($_GET['studentid']) {
			$sid = $_GET['studentid'];
		} else {
			$sid = $_POST['studentid'];
		}
		
		$sql = sprintf("SELECT * from `int_rosters`, `int_students` WHERE int_rosters.courseID = '%s' AND int_rosters.studentID = int_students.studentID AND int_rosters.studentID = '%s' ORDER BY int_students.lastName, int_students.firstName", mysql_real_escape_string($cid), mysql_real_escape_string($sid));
		$result = mysql_query($sql);
		$error = '';
		if (!$result) {
			$error = mysql_error();				
		} else {
			$error = '';
		}

		$studentsstring = '';
		while ($student_row = mysql_fetch_assoc($result)) {
			$firstname = $student_row['firstName'];
			$lastname = $student_row['lastName'];
			$studentid = $student_row['studentID'];
			$out = $student_row['outstanding'];
			if ($out == NULL) {
					$out = '0';
				}
			$sat = $student_row['satisfactory'];
			if ($sat == NULL) {
					$sat = '0';
				}
			$unsat = $student_row['unsatisfactory'];
			if ($unsat == NULL) {
					$unsat = '0';
				}
			$fail = $student_row['failing'];
			if ($fail == NULL) {
					$fail = '0';
				}
			$comm = $student_row['comments'];
			if ($comm == NULL) {
					$comm = ' ';
				}
			$mod = $student_row['modified'];
			if ($mod == NULL) {
					$mod = ' ';
				}
			$modby = $student_row['modified_by'];
			if ($modby == NULL) {
					$modby = ' ';
			}
			$codes = $student_row['codes'];
			if ($codes == NULL) {
					$codes = ' ';
			}
			$studentsstring = $studentsstring . sprintf($sXMLstudentTemplate, $studentid, $firstname, $lastname, $out, $sat, $unsat, $fail, $comm, $mod, $modby, $codes);
		}
		$output = sprintf($aXMLRespTypes['getstudent'], $error, $studentsstring);
		
			
		break;
} // end switch

if (!empty($output))
{
	header("HTTP/1.1 200 OK");
    header("Content-type: text/xml");
    echo $sXMLHeader . $output;
}
else
{
    // no output means error
    
    // Send http status code. this is important because the javascript checks 
    // the http status code to determine whether to act on the response.
    header("HTTP/1.1 400 Bad Request");
} // end if



?>