<?php
	$debug = false;

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
	
	if ($_POST['task']=='getclasses') {

		header('Content-type: text/xml');
		$returnValue = "<?xml version=\"1.0\" ?><getclasses>";
		
		// formulate the query
		$sql = 'SELECT * FROM int_courses WHERE teacherID = \'' . mysql_real_escape_string($_POST['teacherid']) . '\'';
		if ($debug) {
				echo("query.php:  task = getclasses; query = " . $sql . "<br />");
		}
		$result = mysql_query($sql);
		
		if (!$result) {
			die('0|Could not connect to login database.  Please try again.');
			if ($debug) { echo('died'); }
		}

		if ($debug) {
				echo('query.php:  returnValue = ' . $returnValue . '<br />');
		}

		while ($course_row = mysql_fetch_assoc($result)) {

			$returnValue = $returnValue . "<course><courseid>"  . $course_row['courseID'] . '</courseid>' . '<coursetitle>' .  $course_row['title'] . '</coursetitle></course>' ;
			if ($debug) {
					echo('query.php:  returnValue = ' . $returnValue  . '<br />');
			}
		}

		echo $returnValue . '</getclasses>';
	}


/*
 *
 *		task getallstudents
 *
 *
 *
 *
 */


	if ($_POST['task']=='getallstudents') {
	
		header('Content-type: text/xml');
		$returnValue = "<?xml version=\"1.0\" ?><getallstudents>";

		$sql = sprintf("SELECT * from `int_rosters`, `int_students` WHERE int_rosters.courseID = '%s' AND int_rosters.studentID = int_students.studentID ORDER BY int_students.lastName, int_students.firstName", mysql_real_escape_string($_POST['courseid']));

		if ($debug) {
			echo('query.php:  $sql = ' . $sql . '<br />');
		}

		$result = mysql_query($sql);

		if (!$result) {
			die('0');
			if ($debug) { echo('<error>Error</error>'); }
		}
	
		while ($student_row = mysql_fetch_assoc($result)) {
			$returnValue  = $returnValue . '<student>';
			$returnValue  = $returnValue . '<studentid>' . $student_row['studentID'] . '</studentid>';
			$returnValue  = $returnValue . '<firstname>' . $student_row['firstName'] . '</firstname>';
			$returnValue  = $returnValue . '<lastname>' . $student_row['lastName'] . '</lastname>';
			$sat = $student_row['satisfactory'];
			if ($sat == NULL) {
					$sat = ' ';
				}
			$unsat = $student_row['unsatisfactory'];
			if ($unsat == NULL) {
					$unsat = ' ';
				}
			$fail = $student_row['failing'];
			if ($fail == NULL) {
					$fail = ' ';
				}
			$comm = $student_row['comments'];
			if ($comm == NULL) {
					$comm = ' ';
				}
			$danger = $student_row['danger'];
			if ($danger == NULL) {
					$danger = ' ';
				}
			$mod = $student_row['modified'];
			if ($mod == NULL) {
					$mod = ' ';
				}
			$modby = $student_row['modified_by'];
			if ($modby == NULL) {
					$modby = ' ';
			}
			$returnValue  = $returnValue . '<sat>' . $sat. '</sat>';
			$returnValue  = $returnValue . '<unsat>' . $unsat . '</unsat>';
			$returnValue  = $returnValue . '<failing>' . $fail . '</failing>';
			$returnValue  = $returnValue . '<comments>' . $comm . '</comments>';
			$returnValue  = $returnValue . '<danger>' . $danger . '</danger>';
			$returnValue  = $returnValue . '<modified>' . $mod . '</modified>';	
			$returnValue  = $returnValue . '<modifiedby>' . $modby . '</modifiedby>';	
			$returnValue  = $returnValue . '</student>';
			if ($debug) {
					echo('query.php:  returnValue = ' . $returnValue  . '<br />');
			}
		}
		echo $returnValue . '</getallstudents>';
	}


/*
 *
 *		task writeback
 *
 *
 *
 *
 */


	if ($_POST['task']=='writeback') {

		header('Content-type: text/xml');
		$returnValue = "<?xml version=\"1.0\" ?><writeback>";

		$sql = sprintf("UPDATE `int_rosters` SET `satisfactory` = '%s', `unsatisfactory` = '%s', `failing` = '%s', `comments` = '%s', `danger` = '%s', `modified` = UNIX_TIMESTAMP(NOW()), `modified_by` = '%s' WHERE `courseID` = '%s' AND `studentID` = '%s' LIMIT 1", 
						mysql_real_escape_string($_POST['sat']), mysql_real_escape_string($_POST['unsat']), mysql_real_escape_string($_POST['fail']), mysql_real_escape_string($_POST['comments']), mysql_real_escape_string($_POST['danger']), mysql_real_escape_string($_POST['teacherid']), mysql_real_escape_string($_POST['courseid']), mysql_real_escape_string($_POST['studentid']));
		if ($debug) {
			echo('query.php:  $sql = ' . $sql . '<br />');
		}
		$result = mysql_query($sql);


		if (!$result) {
			die('0');
			if ($debug) { echo('<error>Error</error></writeback>'); }
		}

		$returnValue = $returnValue . '<number>' . mysql_affected_rows() . '</number></writeback>';

		echo $returnValue;

	}

/*
 *
 *		task defaults
 *
 *
 *
 *
 */


	
	if ($_POST['task']=='defaults') {

		header('Content-type: text/xml');
		$returnValue = "<?xml version=\"1.0\" ?><defaults>";
		

		$sql = sprintf("SELECT * from `int_defaults`");

		if ($debug) {
			echo('query.php:  $sql = ' . $sql . '<br />');
		}

		$result = mysql_query($sql);

		if (!$result) {
			die('<error>Error</error>');
			if ($debug) { echo('<error>Error</error>'); }
		}

		while ($row = mysql_fetch_assoc($result)) {
			$returnValue = $returnValue . '<default>';
			$returnValue = $returnValue . '<key>' . $row['key'] . '</key>';
			$returnValue = $returnValue . '<value>' . $row['value'] . '</value>';
			$returnValue = $returnValue . '</default>';
		}
		
		echo $returnValue . '</defaults>';
	
	}
	if ($debug) { echo "<debug>OK</debug>"; }

/*
 *
 *		task getcodes
 *
 *
 *
 *
 */
	
	if ($_POST['task']=='getcodes') {

		header('Content-type: text/xml');
		$returnValue = "<?xml version=\"1.0\" ?><codes>";
		

		$sql = sprintf("SELECT * from `int_codes`");

		if ($debug) {
			echo('query.php:  $sql = ' . $sql . '<br />');
		}

		$result = mysql_query($sql);

		if (!$result) {
			die('<error>Error</error>');
			if ($debug) { echo('<error>Error</error>'); }
		}
		
		while ($row = mysql_fetch_assoc($result)) {
			$returnValue = $returnValue . '<code>';
			$returnValue = $returnValue . '<codeID>' . $row['code'] . '</codeID>';
			$returnValue = $returnValue . '<text>' . $row['text'] . '</text>';
			$returnValue = $returnValue . '</code>';
		}
		echo $returnValue . '</codes>';		
	}

?>
