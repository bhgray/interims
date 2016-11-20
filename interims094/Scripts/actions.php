<?php
/*
	actions.php
	Version:  2006-07-12-2142
	
	Changelog:
	
	+ added JSON support to login
*/

dl("tests/json.so");

 function getloginInsecure() 
{
	global $debug, $aXMLRespTypes;
	
	if ($_GET['username']) {
		$username = $_GET['username'];
	} else {
		$username = $_POST['username'];
	}

	if ($_GET['password']) {
		$password = $_GET['password'];
	} else {
		$password = $_POST['password'];
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

	if ($debug) { echo $user_row['password'] == $password; }
	if ( $user_row['password'] == $password ) {
		session_start();
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
		// register this successful login as the last_login for next time!
		$sql = 'UPDATE `int_teachers` SET `last_login` = UNIX_TIMESTAMP(NOW()) WHERE `schoolDistrictID` = \'' . $user_row['schoolDistrictID'] . '\'';
		$result = mysql_query($sql);
// 		if reason exists, we can set the $_SESSION variable for use later
// 		$_SESSION['username'] = $name;
// 		$_SESSION['logged'] = 1;
// 		$_SESSION['auth'] = $auth;
// 		$_SESSION['message'] = $message;
	} else {
		$error = $error . 'Invalid username/password combination';
		$name = '';
		$sdid = '';
		$auth = '';
		$lastlogin = '';
		$message = '';
		$completedcount = '';
		$totalcount = '';			
//		$_SESSION['logged'] = 0;
	}
	/*
		Non-JSON methods
	$output = sprintf($aXMLRespTypes['getlogin'], $error, $name, $sdid, $auth, $lastlogin, $message, $completedcount, $totalcount);
	return $output;
	*/


	// query:  user.courses is an array of course objects... should we store it and return it now?
	//			it will obviously be used later.....  or perhaps only do the courseIDs now to 
	//			save bandwidth.
	$courses = getCoursesAsArray($sdid);
	$output = array("name" => $name,
					"teacherID" => $sdid,
					"privileges" => $auth,
					"lastLogin" => $lastlogin,
					"userMessage" => $message,
					"completedInterims" => $completedcount,
					"totalInterims" => $totalcount,
					"courses" => $courses
				);
	$json_output = json_encode($output);
	return $json_output;
 }
 
function getCoursesAsArray($id) 
{
	global $debug;
	
	$sql = 'SELECT * FROM int_courses WHERE teacherID = \'' . mysql_real_escape_string($id) . '\'';
	$result = mysql_query($sql);
	$error = '';
	if (!$result) {
		$error = mysql_error();				
	} else {
		$error = '';
	}

	$outputArray = array();
	while ($course_row =  mysql_fetch_assoc($result)) {
		// useage:  like a stack push
		$outputArray[] = array("courseid" => $course_row['courseID'],
								"coursetitle" => $course_row['title']
							  );
	}
	return $outputArray;
}

function getclasses() 
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;
	
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
		$coursesstring = $coursesstring . sprintf($sXMLDefaultTemplates['sXMLcourseTemplate'], $course_row['courseID'], $course_row['title']);
	}
	$output = sprintf($aXMLRespTypes['getclasses'], $error, $coursesstring);
	return $output;
}

function getallstudents ( )
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;
	
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
		$studentsstring = $studentsstring . sprintf($sXMLDefaultTemplates['sXMLstudentTemplate'], $studentid, $firstname, $lastname, $out, $sat, $unsat, $fail, $comm, $mod, $modby, $codes); 
	} 
	$output = sprintf($aXMLRespTypes['getallstudents'], $error, $studentsstring); 
	return $output;
}

function writeback ()
{
	global $debug, $aXMLRespTypes;
	
	if ($_GET['out']) { 
		$out = $_GET['out']; 
	} else { 
		$out = $_POST['out']; 
	} 

	if ($_GET['sat']) { 
		$sat = $_GET['sat']; 
	} else { 
		$sat = $_POST['sat']; 
	} 
		 
	if ($_GET['unsat']) { 
		$unsat = $_GET['unsat']; 
	} else { 
		$unsat = $_POST['unsat']; 
	} 

	if ($_GET['fail']) { 
		$fail = $_GET['fail']; 
	} else { 
		$fail = $_POST['fail']; 
	} 

	if ($_GET['comments']) { 
		$comments = $_GET['comments']; 
	} else { 
		$comments = $_POST['comments']; 
	} 

	if ($_GET['teacherid']) { 
		$teacherid = $_GET['teacherid']; 
	} else { 
		$teacherid = $_POST['teacherid']; 
	} 
	 
	if ($_GET['codes']) { 
		$codes = $_GET['codes']; 
	} else { 
		$codes = $_POST['codes']; 
	} 

	if ($_GET['courseid']) { 
		$courseid = $_GET['courseid']; 
	} else { 
		$courseid = $_POST['courseid']; 
	} 
	 
	if ($_GET['studentid']) { 
		$studentid = $_GET['studentid']; 
	} else { 
		$studentid = $_POST['studentid']; 
	} 

		$sql = sprintf("UPDATE `int_rosters` SET `outstanding` = '%s', `satisfactory` = '%s', `unsatisfactory` = '%s', `failing` = '%s', `comments` = '%s', `modified` = UNIX_TIMESTAMP(NOW()), `modified_by` = '%s', `codes` = '%s' WHERE `courseID` = '%s' AND `studentID` LIKE '%s' LIMIT 1",  
					mysql_real_escape_string($out), mysql_real_escape_string($sat), mysql_real_escape_string($unsat), mysql_real_escape_string($fail), mysql_real_escape_string($comments), mysql_real_escape_string($teacherid), mysql_real_escape_string($codes), mysql_real_escape_string($courseid), mysql_real_escape_string($studentid)); 

	$result = mysql_query($sql); 
	$error = ''; 
	if (!$result) { 
		$error = mysql_error();				 
	} else { 
		$error = ''; 
	} 

	$output = sprintf($aXMLRespTypes['writeback'], $error, mysql_affected_rows(), $studentid); 
	return $output;
}

function getdefaults ( )
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;
	
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
		$defaultsstring = $defaultsstring . sprintf($sXMLDefaultTemplates['sXMLdefaultTemplate'], $key, $value);
	}
	$output = sprintf($aXMLRespTypes['getdefaults'], $error, $defaultsstring);
	return $output;
}

function getcodes (  )
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;

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
		$codesstring = $codesstring . sprintf($sXMLDefaultTemplates['sXMLcodeTemplate'], $code, $text, $order);
	}
	$output = sprintf($aXMLRespTypes['getcodes'], $error, $codesstring);
	return $output;
}

function getstudentnames (  )
{
	global $debug, $aXMLRespTypes, $sXMLDefaultTemplates;
		
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
		$modified = $student_row['modified'];
		$studentsstring = $studentsstring . sprintf($sXMLDefaultTemplates['sXMLstudentNameTemplate'], $studentid, $firstname, $lastname, $modified);
	}
	
	$output = sprintf($aXMLRespTypes['getstudentnames'], $error, $studentsstring);
	return $output;
}

function getstudent ( )
{
	global $debug, $debugXML, $aXMLRespTypes, $sXMLDefaultTemplates;
	
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
	
	$sql = sprintf("SELECT * from int_students, int_rosters WHERE int_students.studentID = int_rosters.studentID AND int_rosters.studentID = '%s' AND int_rosters.courseID = '%s'", mysql_real_escape_string($sid), mysql_real_escape_string($cid));
	$result = mysql_query($sql);
	$error = '';

	if (count($result) == 0) {
		$error = mysql_error();
		if (strlen($error) == 0) {
			$error = 'no record found for class: ' . $cid . '; student: ' . $sid;
		}
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
		$studentsstring = $studentsstring . sprintf($sXMLDefaultTemplates['sXMLstudentTemplate'], $studentid, $firstname, $lastname, $out, $sat, $unsat, $fail, $comm, $mod, $modby, $codes);
	}
	
	$output = sprintf($aXMLRespTypes['getstudent'], $error, $studentsstring);
	
	return $output;
}


?>
