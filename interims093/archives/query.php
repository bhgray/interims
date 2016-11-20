<?php
	$debug = false;
	if ($debug) {
		echo("query.php called<br />");
	}
	$mysql = mysql_connect('localhost', 'bhgray', 'tabasco');
	if (!$mysql) {
		die('0 | cound not log into mysql');
	}
	
	mysql_select_db('bhgray', $mysql);
	
/*
 *
 *		task getclasses
 *
 *
 *
 *
 */
	
	if ($_GET['task']=='getclasses') {
		
		// formulate the query
		$sql = 'SELECT * FROM int_courses WHERE teacherID = \'' . mysql_real_escape_string($_GET['teacherid']) . '\'';
		if ($debug) {
				echo("query.php:  task = getclasses; query = " . $sql . "<br />");
		}
		$result = mysql_query($sql);
		
		if (!$result) {
			die('0|Could not connect to login database.  Please try again.');
			if ($debug) { echo('died'); }
		}
		
		$returnValue = mysql_num_rows($result);
		
		if ($debug) {
				echo('query.php:  returnValue = ' . $returnValue . '<br />');
		}

		while ($course_row = mysql_fetch_assoc($result)) {

			$returnValue = $returnValue . "|"  . $course_row['courseID'] . ',' . '"' .  $course_row['title'] . '"' ;
			if ($debug) {
					echo('query.php:  returnValue = ' . $returnValue  . '<br />');
			}
		}

		echo $returnValue;

/*
 *
 *		task getstudents
 *
 *
 *
 *
 */

	} else if ($_GET['task']=='getstudents') {
		/* formulate the query
			the query needs to user both int_rosters and int_students to get the name...
			SELECT * FROM int_rosters, int_students WHERE int_rosters.courseID = '(courseid)' and int_students.studentID = int_rosters.studentID;
		
		*/
		$sql = 'SELECT * FROM int_rosters, int_students WHERE int_rosters.courseID = \'' . mysql_real_escape_string($_GET['courseid']) . '\' and int_students.studentID = int_rosters.studentID';
		if ($debug) {
				echo("query.php:  task = getstudents; query = " . $sql . "<br />");
		}
		$result = mysql_query($sql);
		
		if (!$result) {
			die('0|Could not connect to login database.  Please try again.');
			if ($debug) { echo('died'); }
		}
		
		$returnValue = mysql_num_rows($result);
		
		if ($debug) {
				echo('query.php:  returnValue = ' . $returnValue . '<br />');
		}

		while ($student_row = mysql_fetch_assoc($result)) {

			$returnValue = $returnValue . "|"  . $student_row['studentID'] . ',' . $student_row['firstName'] . ' ' . $student_row['lastName'] ;
			if ($debug) {
					echo('query.php:  returnValue = ' . $returnValue  . '<br />');
			}
		}

		echo $returnValue;	

/*
 *
 *		task getstudentrecords
 *
 *
 *
 *
 */
		
		
	} else if ($_GET['task']=='getstudentrecord') {

		/* formulate the query */
		

		$sql = 'SELECT * FROM int_rosters WHERE courseID = \'' . mysql_real_escape_string($_GET['courseid']) . '\' and studentID= \'' . mysql_real_escape_string($_GET['studentid']) . '\'';
		if ($debug) {
				echo("query.php:  task = getstudentrecord; query = " . $sql . "<br />");
		}

		$result = mysql_query($sql);

		if (!$result) {
			die('0|Could not connect to database.  Please try again.');
			if ($debug) { echo('i died'); }
		}

		$student_row = mysql_fetch_assoc($result);
		if ($debug) { echo($student_row) . "<br />"; }
		$returnValue = $student_row['satisfactory'] . '|' . $student_row['unsatisfactory'] . '|' . $student_row['failing'] . '|' . $student_row['comments'] . '|' . $student_row['danger'];
		if ($debug) {
				echo('query.php:  returnValue = ' . $returnValue  . '<br />');
		}
		echo $returnValue;


/*
 *
 *		task writeback
 *
 *
 *
 *
 */


	} else if ($_GET['task']=='writeback') {
	
		$sql = sprintf("UPDATE `int_rosters` SET `satisfactory` = '%s', `unsatisfactory` = '%s', `failing` = '%s', `comments` = '%s', `danger` = '%s', `modified` = NOW() WHERE `courseID` = '%s' AND `studentID` = '%s' LIMIT 1", 
						mysql_real_escape_string($_GET['sat']), mysql_real_escape_string($_GET['unsat']), mysql_real_escape_string($_GET['fail']), mysql_real_escape_string($_GET['comments']), mysql_real_escape_string($_GET['danger']), mysql_real_escape_string($_GET['courseid']), mysql_real_escape_string($_GET['studentid']));
		if ($debug) {
			echo('query.php:  $sql = ' . $sql . '<br />');
		}
		$result = mysql_query($sql);

		if (!$result) {
			die('0');
			if ($debug) { echo('i died'); }
		}
		echo mysql_affected_rows();
		
/*
 *
 *		task getallstudents
 *
 *
 *
 *
 */
		
	} else if ($_GET['task']=='getallstudents') {
	
		$sql = sprintf("SELECT * from `int_rosters`, `int_students` WHERE int_rosters.courseID = '%s' AND int_rosters.studentID = int_students.studentID ORDER BY int_students.lastName, int_students.firstName", mysql_real_escape_string($_GET['courseid']));

		if ($debug) {
			echo('query.php:  $sql = ' . $sql . '<br />');
		}

		$result = mysql_query($sql);

		if (!$result) {
			die('0');
			if ($debug) { echo('i died'); }
		}
		
		$student_row = mysql_fetch_assoc($result);
		$returnValue  =  $student_row['studentID'] . ',' . $student_row['firstName'] . ' , ' . $student_row['lastName'] . ',' . $student_row['satisfactory'] . ',' . $student_row['unsatisfactory'] . ',' . $student_row['failing'] . ',' . $student_row['comments'] . ',' . $student_row['danger'];
		while ($student_row = mysql_fetch_assoc($result)) {
			$returnValue = $returnValue . "|"  . $student_row['studentID'] . ',' . $student_row['firstName'] . ' , ' . $student_row['lastName'] . ',' . $student_row['satisfactory'] . ',' . $student_row['unsatisfactory'] . ',' . $student_row['failing'] . ',' . $student_row['comments'] . ',' . $student_row['danger'];
			if ($debug) {
					echo('query.php:  returnValue = ' . $returnValue  . '<br />');
			}
		}
		echo $returnValue;
	}
?>