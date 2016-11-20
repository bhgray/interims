<?php

	$debug = false;
	$debug1 = false;


	$mysql = mysql_connect('localhost', 'bhgray', 'tabasco');
	if (!$mysql) {
		die('<error>no connection</error>');
	}
	
	mysql_select_db('bhgray', $mysql);

	if ($_POST['task']=='getseed') {

		header('Content-type: text/xml');
		$returnValue = "<?xml version=\"1.0\" ?><getseed>";

		// insert a new row with default values
		mysql_query('INSERT INTO int_seeds VALUES()');
		$result = mysql_query('SELECT id, seed FROM int_seeds');
		if (!$result) {
			// we failed!
			die($returnValue . "<error>" . mysql_error() . "</error></getseed>");
		}

		$row = mysql_fetch_assoc($result);
		
		$returnValue = $returnValue . "<id>" . $row['id'] . '</id>' . '<seed>' .  $row['seed'] . '</seed>';
		$returnValue = $returnValue . '</getseed>';

		echo $returnValue;

	} 
	

	if ($_POST['task']=='checklogin') {
	
		header('Content-type: text/xml');
		$returnValue = "<?xml version=\"1.0\" ?><checklogin>";

		if ($debug1) {
			$name = 'grayb';
		} else {
			$name = $_POST['username'];
		}

		// formulate the query
		$sql = 'SELECT * FROM int_teachers WHERE username = \'' . mysql_real_escape_string($name) . '\'';
		$result = mysql_query($sql);
		
		if (!$result) {
			die($returnValue . "<error>" . mysql_error() . "</error></checklogin>");
		}
		
		// fetch the username from the table
		$user_row = mysql_fetch_assoc($result);
		if (!$user_row) {
			die($returnValue . "<error>Bad username/password combination</error></checklogin>");
		}
	
		if ($debug1) {
			$id = '0';
		} else {
			$id = $_POST['id'];
		}
	
		$sql = 'SELECT * FROM int_seeds WHERE id=' . (int)$id;
		$result = mysql_query($sql);

		// fetch the seed (the only one in the db)
		$seed_row = mysql_fetch_assoc($result);

		if (!$seed_row) {
			die($returnValue . "<error>Hacking attempt.  Login failed.</error></checklogin>");
		}

		if ( md5(md5($user_row['password']).$seed_row['seed']) == $_POST['hash'] ) {
			// success!  the user has logged in
			
			$returnValue = $returnValue . '<name>' . $user_row['firstName'] . ' ' . $user_row['lastName'] . '</name>';
			$returnValue = $returnValue . '<schoolDistrictID>' . $user_row['schoolDistrictID'] . '</schoolDistrictID>';
			$returnValue = $returnValue . '<authlevel>'. $user_row['auth_level'] . '</authlevel>';
			
			// last_login is null if first time logging in!
			$lastlogin = $user_row['last_login'];
			if ($lastlogin == NULL) {
				$lastlogin = '0';
			}

			// last_login is null if first time logging in!
			$message = $user_row['message'];
			if ($message == NULL) {
				$message = ' ';
			}

			// GET THE STATUS OF THE USERS INTERIM REPORTS
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

			$returnValue = $returnValue . '<lastlogin>'. $lastlogin . '</lastlogin>';
			$returnValue = $returnValue . '<message>' . $message . '</message>';
			$returnValue = $returnValue . '<completed>' . $completedcount . '</completed>';
			$returnValue = $returnValue . '<totals>' . $totalcount . '</totals>';
			$returnValue = $returnValue . '</checklogin>';

			// now that we are logged in, delete the seed
			$sql = 'DELETE FROM `int_seeds` WHERE id=\'' . (int)$id . '\'';
			mysql_query($sql);
			
			// register this successful login as the last_login for next time!
			$sql = 'UPDATE `int_teachers` SET `last_login` = UNIX_TIMESTAMP(NOW()) WHERE `schoolDistrictID` = \'' . $user_row['schoolDistrictID'] . '\'';
			mysql_query($sql);
			
			echo $returnValue;

		} else {

			// not logged in -- incorrect password
			die($returnValue . "<error>Bad username/password combination</error></checklogin>");
		}
	}
	
?>