function setupLogin()
{
	window.resizeTo(850, 700);
	if (debugLogin) {alert('setupLogin() called');}
	clearMenus();
	clearFunctions();
	clearContent();
	clearMessages();
	getSeed();
	setUpLoginPanel();
}

function logout()
{
	resetLogin();
	setupLogin();
}

function resetLogin()
{
	loggedIn = false;
	hasSeed = false;
}

// getSeed method:  gets a seed from the server for this session
// 	should we switch to a cookie sessionid system?
function getSeed() 
{		
	// only get a seed if we're not logged in
	if (!loggedIn && !hasSeed) {
		if (debugLogin) {
			alert('controller.js:  getSeed()');
		} // end if

		var url = QUERY;
		var pars = 'task=getseed';
		var myAjax = new Ajax.Request(
					url, 
					{
						method: 'get', 
						parameters: pars,
						onComplete: seedSuccess
					});
	} // end if 
} // end getSeed()

function seedSuccess(o) 
{
	if (debugLogin) {
		alert('seedCallback success!');
	}
	xmldoc = o.responseXML;
	seed_id = xmldoc.getElementsByTagName('id').item(0).firstChild.data;
	seed = xmldoc.getElementsByTagName('seed').item(0).firstChild.data;
	if (debugLogin) { alert('controller.js:  handleHttpGetSeed() with response --> ' + seed_id + ',' + seed); }
	hasSeed = true;
} // end getSuccess

function seedFailure(o) 
{
	if (debugLogin) {
		alert('seedCallback failure with error message: ' + o.statusText);
	}
}

// validateLogin method: validates a login request
function validateLogin()
{

	// get form form elements 'username' and 'password'
	var username = $F('username');
	var password = $F('password');

	// ignore if either is empty
	if (username != '' && password  != '') {
		// compute the hash of the hash of the password and the seed
		var hash = hex_md5(hex_md5(password) + seed);
		if (debugLogin) {
			alert("controller.js:  validateLogin() called:  " + username + "/" + password);
		}	

		var url = QUERY;
		var pars = 'task=getlogin&username=' + username + '&id=' + seed_id + '&hash=' + hash;
		var myAjax = new Ajax.Request(
					url, 
					{
						method: 'get', 
						parameters: pars,
						onSuccess: loginSuccess,
						onFailure: loginFailure
					});
	} // end if
} // end validateLogin()

function loginSuccess(o) 
{
	if (debugLogin) {
		alert('loginCallback success!');
	}
	xmldoc = o.responseXML;
	hasSeed = false;
	loggedIn = true;
	user.name = xmldoc.getElementsByTagName('name').item(0).firstChild.data;
	user.teacherID = xmldoc.getElementsByTagName('schoolDistrictID').item(0).firstChild.data; 
	user.privileges = xmldoc.getElementsByTagName('authlevel').item(0).firstChild.data;
	user.lastLogin = xmldoc.getElementsByTagName('lastlogin').item(0).firstChild.data;
	user.userMessage = xmldoc.getElementsByTagName('message').item(0).firstChild.data;
	user.completedInterims = xmldoc.getElementsByTagName('completed').item(0).firstChild.data;
//	user.totalInterims = xmldoc.getElementsByTagName('totals').item(0).firstChild.data;
	getDefaults();
}

function loginFailure(o) 
{
	if (debugLogin) {
		alert('seedCallback failure with error message: ' + o.statusText);
	}
}

function getDefaults()
{
	var defaultsCallback  = 
	{
		success:	defaultsSuccess,
		failure:	defaultsFailure
	}
	
	var url = QUERY;
	var pars = 'task=getdefaults';
	var myAjax = new Ajax.Request(
				url, 
				{
					method: 'get', 
					parameters: pars,
					onSuccess: defaultsSuccess,
					onFailure: defaultsFailure
				});

}

function defaultsSuccess(o) 
{
	defaults = new Array();
	var rows = o.responseXML.getElementsByTagName('default');
	if (debugDefaults) { alert('controller.js:  defaultsSuccess() returned OK with ' + rows.length + ' rows.');}
	for (i = 0; i < rows.length; i++) {
		row = rows[i];
		key = row.getElementsByTagName('key').item(0).firstChild.data;
		value = row.getElementsByTagName('value').item(0).firstChild.data;
		if (debugDefaults) { alert('defaultsSuccess() adding defaults[' + key + '] = ' + value); }
		defaults[key] = value;
	}
	if (debugDefaults) {
		alert('controller.js:  handleHttpDefaults():  defaults are --> ' + defaults);
	}
	showLogin();
}

function defaultsFailure(o) 
{
	if (debugDefaults) {
		alert('controller.js:  defaultsFailure() with message --> ' + o.statusText);
	}		
}

function findDefaultWithKey(key)
{
	if (debugDefaults) { 
		alert('controller.js:  findDefaultWithKey:  finding ' + key);
	}
	if (!(temp = defaults[key])) {
		return ""; 
	} else {
		return defaults[key];
	}
}

function getClasses() 
{
	var url = QUERY;
	var pars = 'task=getclasses&teacherid=' + user.teacherID;
	var myAjax = new Ajax.Request(
				url, 
				{
					method: 'get', 
					parameters: pars,
					onSuccess: classesSuccess,
					onFailure: classesFailure
				});
}

function classesSuccess(o) 
{
	/*
		return is as follows:  
		<getclasses>
			<number></number>
			<course>
				<courseid></courseid>
				<coursetitle></coursetitle>
			</course>
		</getclasses>
	
	*/
	user.courses = new Array();
	rows = o.responseXML.getElementsByTagName('course');
	for (i = 0; i < rows.length; i++) {
		// put the comma-separated strings into the classesArray, thus
		// each entry would look like:  6824-1, Algebra 2
		courseid = rows[i].getElementsByTagName('courseid').item(0).firstChild.data;
		coursetitle = rows[i].getElementsByTagName('coursetitle').item(0).firstChild.data;
		user.courses[courseid] = coursetitle;
	}
	createClassesMenu();
}

function classesFailure(o) 
{
	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (error) {
		if (debugClassesMenu) { alert('controller.js:  handleHttpGetClasses returned error --> ' + error.data); }
	}
}

function editClassInterims() 
{
	clearContent();	
	
	var selectedClassID = $F('classes');
	
	// get an array of all the students in the class
	getStudentNames(selectedClassID);
}

function namesSuccess(o) 
{
	/*
	<student>
		<studentid></studentid>
		<firstname></firstname>
		<lastname></lastname>
		<status></status>
	</student>
	*/
	var results;
	studentsArray = new Array();
	var rows = o.responseXML.getElementsByTagName('student');
	if (debugStudentNames) { alert('controller.js ::  namesSuccess() returned ' + rows.length + ' rows'); }	
	// loop through the students; at the end of the loop, each array entry will contain
	// an array with the fields from the db
	var rs = $A(rows);
	var count = 0;
	rs.each( function(r) {
		id = r.getElementsByTagName('studentid').item(0).firstChild.data;
		lastName = new String(r.getElementsByTagName('lastname').item(0).firstChild.data);
		firstName = new String(r.getElementsByTagName('firstname').item(0).firstChild.data);
		name = lastName.toUpperCase();
		name = name + ', ';
		name = name + firstName.substring(0, 1).toUpperCase() + firstName.substr(1).toLowerCase();
		modified = r.getElementsByTagName('modified').item(0).firstChild.data;
		studentsArray[count++] = new Student(id, name, modified);
		if (debugStudentNames) {alert('namesSuccess --> ' + id + ":" + lastName)}		
	});

	if (debugStudentNames1) {alert('HSWcontroller.js :: namesSuccess :: rows created -->' + studentsArray.length)}		
	if (studentsArray.length > 0) {
		createNamesMenu();
	}
}

function namesFailure(o) 
{
	if (debugNames) {
		alert('namesFailure');
	}

}

function getStudentNames(selectedClassID) 
{	
	if (debugStudentNames) { alert('controller.js:  getStudentNames(): ' + selectedClassID); }
	var url = QUERY;
	var pars = 'task=getstudentnames&courseid=' + selectedClassID;
	
	var myAjax = new Ajax.Request(
				url, 
				{
					method: 'get', 
					parameters: pars,
					onSuccess: namesSuccess,
					onFailure: namesFailure
				});
}

function getStudentInterim (studentID, courseID)
{
	var readInterimCallback =
	{
		success:	readInterimSuccess,
		failure:	readInterimFailure
	}

	targetRow = document.getElementById(studentID);
	targetRow.className = 'active';
	url = QUERY + '?task=getstudent&courseid=' + courseID + '&studentid=' + studentID;
	cObj = YAHOO.util.Connect.asyncRequest('GET', url, readInterimCallback, null);
}

// 	todo:  read in interim and create the view

function readInterimSuccess (o)
{
	if (!YAHOO.util.Connect.isCallInProgress(cObj)) {
		// there will only be one row, hopefully :-(
		result = o.responseXML.getElementsByTagName('student').item(0);
		
		studentid = result.getElementsByTagName('studentid').item(0).firstChild.data;
		student = studentsArray[studentid];
		student.setOut(result.getElementsByTagName('out').item(0).firstChild.data);
		student.setSat(result.getElementsByTagName('sat').item(0).firstChild.data);
		student.setUnsat(result.getElementsByTagName('unsat').item(0).firstChild.data);
		student.setFail(result.getElementsByTagName('failing').item(0).firstChild.data);
		student.setComments(result.getElementsByTagName('comments').item(0).firstChild.data);
		student.setCodes(result.getElementsByTagName('codes').item(0).firstChild.data);
		createInterimEditPane(student);
		YAHOO.util.Connect.releaseObject(cObj);
	}
}

function readInterimFailure (o)
{

}

function getCodes() 
{

	var url = QUERY;
	var pars = 'task=getcodes';
	var myAjax = new Ajax.Request(
				url, 
				{
					method: 'get', 
					parameters: pars,
					onSuccess: codesSuccess,
					onFailure: codesFailure
				});
}

function codesSuccess(o) 
{
	rows = o.responseXML.getElementsByTagName('code');
	codesArray = new Array();
	for (i = 0; i < rows.length; i++) {
		row = rows[i];
		id = row.getElementsByTagName('codeid').item(0).firstChild.data;
		text = row.getElementsByTagName('text').item(0).firstChild.data;
		display = row.getElementsByTagName('order').item(0).firstChild.data;
		code = new Code(id, text);
		codesArray[display] = code;
	}
}

function codesFailure(o)
{
	alert('codes failure');
}

function validateCheckboxPairs(thesource) 
{
	checkboxes = document.getElementsByName(thesource);
	if (!checkboxes[0] || !checkboxes[1]) { return; }
	if (checkboxes[0].checked && checkboxes[1].checked) {
		alert('Error:  only one checkbox may be selected for this interim code category');
		checkboxes[0].checked = false;
		checkboxes[1].checked = false;
	}
}

function resetAllRowStatus() 
{
	t = document.getElementById('ntable');
	for (i = 0; i < t.rows.length; i++) {
		row = t.rows[i];
		alert('resetting:  ' + row.id + " to " + studentsArray[row.id].modified);
		if (studentsArray[row.id].modified > findDefaultWithKey(OPENS_KEY)) {
			row.className = 'edited';
		} else {
			row.className = 'unedited';
		}
	}
}