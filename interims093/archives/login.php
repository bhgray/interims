<?php

	$debug = false;

	$mysql = mysql_connect('localhost', 'bhgray', 'tabasco');
	if (!$mysql) {
		die('failed | cound not log into mysql');
	}
	
	mysql_select_db('bhgray', $mysql);
	
	if ($_GET['task']=='getseed') {
		// insert a new row with default values
		mysql_query('INSERT INTO int_seeds VALUES()');
		$result = mysql_query('SELECT id, seed FROM int_seeds');
		if (!$result) {
			// we failed!
			die('false|' . mysql_error());
		}
		// there is only one row, so take that one!
		$row = mysql_fetch_assoc($result);
		// and write back the data in the form id|random_value
		echo($row['id'].'|'.$row['seed']);
	} else if ($_GET['task']=='checklogin') {
		// formulate the query
		$sql = 'SELECT * FROM int_teachers WHERE username = \'' . mysql_real_escape_string($_GET['username']) . '\'';
		$result = mysql_query($sql);
		if (!$result) {
			die('false|Could not connect to login database.  Please try again.');
		}
		
		// fetch the username from the table
		$user_row = mysql_fetch_assoc($result);
		if (!$user_row) {
			die('false|Invalid user/password combination');
		}
		
		$sql = 'SELECT * FROM int_seeds WHERE id=' . (int)$_GET['id'];
		$result = mysql_query($sql);
		// fetch the seed (the only one in the db)
		$seed_row = mysql_fetch_assoc($result);
		if (!$seed_row) {
			die('false|unknown error (hacking attempt)');
		}
		// check to see that the md5 hash is the same
		if ( md5(md5($user_row['password']).$seed_row['seed']) == $_GET['hash'] ) {
			// success!  the user has logged in
			echo('true|' . $user_row['firstName'] . ' ' . $user_row['lastName'] . '|' . $user_row['schoolDistrictID'] . '|' . $user_row['auth_level']);
			mysql_query('DELETE FROM int_seeds WHERE id=' . (int)$_GET['id']);
		} else {
			// not logged in -- incorrect password
			//echo('false|md5 = ' . md5($user_row['password'].$seed_row['seed']) . 'hash = ' . $_GET['hash']);
			die('false|invalid user/password combination');
		}
	}
	
?>