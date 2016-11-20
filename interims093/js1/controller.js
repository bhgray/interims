// getSeed method:  gets a seed from the server for this transaction
function getSeed() 
{		
		// only get a seed if we're not logged in and we don't already have one
		if (!loggedIn && !hasSeed) {
			if (debuglogin) {
				alert('controller.js:  getSeed()');
			}
			http.setRespHandler('getseed', handleHttpGetSeed);
			url = QUERY + '?task=getseed';
			if (debugC1) { alert('controller.js:  getSeed(): ' + url); }
			http.request(url);
		} 
}

// handleHttpGetSeed method: called when the seed is returned from the server
function handleHttpGetSeed(xmldoc)
{
	if (debuglogin) {
		alert('controller.js:  handleHttpGetSeed() called with element ' + xmldoc.nodeValue);
	}
	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (!error) {
		seed_id = xmldoc.getElementsByTagName('id').item(0).firstChild.data;
		seed = xmldoc.getElementsByTagName('seed').item(0).firstChild.data;
		if (debuglogin) { alert('controller.js:  handleHttpGetSeed() with response --> ' + seed_id + ',' + seed); }
		hasSeed = true;
	} else {
//		handleError(ERR_GETSEED, error);
		if (debugerrorhandling) { alert('Error at handleHttpGetSeed: ' + error.data); }
	}
}

// validateLogin method: validates a login request
function validateLogin()
{
	// ignore request if we are already logged in
	if (loggedIn)
		return;

	// get form form elements 'username' and 'password'
	username = document.getElementById('username').value;
	password = document.getElementById('password').value;

	// ignore if either is empty
	if (username != '' && password  != '') {
		// compute the hash of the hash of the password and the seed
		hash = hex_md5(hex_md5(password) + seed);
		if (debuglogin) {
			alert("controller.js:  validateLogin() called:  " + username + "/" + password);
		}		
		// open the http connection
		http.setRespHandler("getlogin", handleHttpValidateLogin);
		url = QUERY + '?task=getlogin&username='+username+'&id='+seed_id+'&hash='+hash;
		if (debugC1) { alert('controller.js:  validateLogin(): ' + url); }
		http.request(url);
	}
}

// handleHttpValidateLogin method: called when the validation results are returned from the server
function handleHttpValidateLogin(xmldoc)
{
	if (debuglogin) {
		alert('controller.js:  handleHttpValidateLogin() called');
	}
	messages='';
	// did the connection work?
	if (debuglogin) {
		alert("controller.js:  handleHttpValidateLogin() captured xmldoc --> " + xmldoc.nodeValue);
	}
	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (error) {
		if (debuglogin) { alert('controller.js:  handleHttpValidateLogin returned error --> ' + error.data); }
	//	handleError(ERR_LOGIN, error.data);	
	} else {
		if (debuglogin) { alert('controller.js:  handleHttpValidateLogin() returned OK');}
		hasSeed = false;
		loggedIn = true;
		fullname = xmldoc.getElementsByTagName('name').item(0).firstChild.data;
		teacherid = xmldoc.getElementsByTagName('schoolDistrictID').item(0).firstChild.data; 
		privileges = xmldoc.getElementsByTagName('authlevel').item(0).firstChild.data;
		lastlogin = xmldoc.getElementsByTagName('lastlogin').item(0).firstChild.data;
		usermessage = xmldoc.getElementsByTagName('message').item(0).firstChild.data;
		completedinterims = xmldoc.getElementsByTagName('completed').item(0).firstChild.data;
	//	totalinterims = xmldoc.getElementsByTagName('totals').item(0).firstChild.data;
		showLogin();
	}
}

function getDefaults()
{

	http.setRespHandler('getdefaults', handleHttpDefaults);
	url = QUERY + '?task=getdefaults';
	http.request(url);
}

function handleHttpDefaults(xmldoc) {
	
	if (debugdefaults) {
		alert("controller.js:  handleHttpDefaults() captured xmldoc --> " + xmldoc);
	}
	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (error) {
		if (debugdefaults) { alert('controller.js:  handleHttpDefaults returned error --> ' + error.data); }
		//	handleError(ERR_DEFAULTS, error.data);	
	} else {
		defaultsArray = new Array();
		var rows = xmldoc.getElementsByTagName('default');
		if (debugdefaults) { alert('controller.js:  handleHttpDefaults() returned OK with ' + rows.length + ' rows.');}
		var i;
		for (i = 0; i < rows.length; i++) {
			var info = new Array(2);
			var row = rows[i];
			info[KEY] = row.getElementsByTagName('key').item(0).firstChild.data;
			info[VALUE] = row.getElementsByTagName('value').item(0).firstChild.data;
			defaultsArray.push(info);
		}
		if (debugdefaults) {
			alert('controller.js:  handleHttpDefaults():  defaults are --> ' + defaultsArray);
		}
	}
}

// resetLogin method: if logged in, 'logs out' and allows a different user/pass to be entered
function resetLogin()
{
	loggedIn = false;
	hasSeed = false;
}

function getClasses() {

	//open the http connection
	if (debugC4) {
		alert("controller.js:  getClasses() called querying for teacherid = " + teacherid);
	}
	
	http.setRespHandler('getclasses', handleHttpGetClasses);
	url = QUERY + '?task=getclasses&teacherid=' + teacherid;
	if (debugC1) { alert('controller.js:  getClasses(): ' + url); }
	http.request(url);
}

function handleHttpGetClasses(xmldoc) {
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
	if (debugC4) { alert("controller.js:  handleHttpGetClasses() responded with XML:  " + xmldoc); }
	
	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (error) {
		if (debugC4) { alert('controller.js:  handleHttpGetClasses returned error --> ' + error.data); }
		//	handleError(ERR_GETCLASSES, error.data);	
	} else {
		coursesArray = new Array();
		var rows = xmldoc.getElementsByTagName('course');
		if (debugC4) { alert("controller.js:  handleHttpGetClasses() responded rows:  " + rows.length); }
		var i;
		for (i = 0; i < rows.length; i++) {
			// put the comma-separated strings into the classesArray, thus
			// each entry would look like:  6824-1, Algebra 2
			var courseid = rows[i].getElementsByTagName('courseid').item(0).firstChild.data;
			var coursetitle = rows[i].getElementsByTagName('coursetitle').item(0).firstChild.data;					
			if (debugC4) { alert('controller.js:  handleHttpGetClasses():  result -> ' + courseid + "," + coursetitle); }
			info = new Array(2);
			info[COURSEID] = courseid;
			info[COURSETITLE] = coursetitle;
			coursesArray.push(info);
		}
		if (debugC4) { alert('controller.js:  handleHttpGetClasses():  coursesArray -->' + coursesArray); }
		createClassesMenu();
	}
}

function openStudentRecord(classid, studentid) {
	
	http.setRespHandler('getstudent', handleHttpGetStudent);
	url = QUERY + '?TASK=getstudent&courseid=' + classid + '&studentid=' + studentid;
	http.request(url);
}

function handleHttpGetStudent(xmldoc) {
	/*
	<student>
		<studentid></studentid>
		<firstname></firstname>
		<lastname></lastname>
		<sat></sat>
		<unsat></unsat>
		<failing></failing>
		<comments></comments>
	</student>
	*/
	
	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (error) {
	
	} else {
		studentarray = new Array();
		var row = xmldoc.getElementsByTagName('student').item(0).firstChild;
		studentarray[ID] = row.getElementsByTagName('studentid').item(0).firstChild.data;
		studentarray[FIRST_NAME] = row.getElementsByTagName('firstname').item(0).firstChild.data;
		studentarray[LAST_NAME] = row.getElementsByTagName('lastname').item(0).firstChild.data;
		studentarray[OUTSTANDING_ITEM] = row.getElementsByTagName('out').item(0).firstChild.data;
		studentarray[SATISFACTORY_ITEM] = row.getElementsByTagName('sat').item(0).firstChild.data;
		studentarray[UNSATISFACTORY_ITEM] = row.getElementsByTagName('unsat').item(0).firstChild.data;
		studentarray[FAILING_ITEM] = row.getElementsByTagName('failing').item(0).firstChild.data;
		studentarray[COMMENTS_ITEM] = row.getElementsByTagName('comments').item(0).firstChild.data;
		studentarray[MODIFIED] = row.getElementsByTagName('modified').item(0).firstChild.data;
		studentarray[MODIFIED_BY] = row.getElementsByTagName('modifiedby').item(0).firstChild.data;
		studentarray[CODES] = row.getElementsByTagName('codes').item(0).firstChild.data;
	}
}

function editWithClass() {

	clearContent();
	
	var classes = document.getElementById('classes');
	var selectedOption = classes.selectedIndex;
	var selectedClassID = classes.options[selectedOption].value;
	currentClassName = classes.options[selectedOption].text;
	
	if (debugC1) {
		alert('controller.js:  editWithClass() value --> ' + selectedClassID);
	}

	// get an array of all the students in the class
	currentClassID = selectedClassID;
	getStudentNames(selectedClassID);
}

function getStudentNames(selectedClassID) {	
	if (debugC1) { alert('controller.js:  getStudentNames(): ' + selectedClassID); }
	http.setRespHandler('getstudentnames', handleHttpGetStudentNames);
	url = QUERY + '?task=getstudentnames&courseid=' + selectedClassID;
	if (debugC1) { alert('controller.js:  getStudentNames(): ' + url); }	
	http.request(url);
}

function handleHttpGetStudentNames(xmldoc) {
	/*
	<student>
		<studentid></studentid>
		<firstname></firstname>
		<lastname></lastname>
	</student>
	*/
	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (error) {
		if (debugC1) { alert('controller.js:  handleHttpGetAllStudents returned error --> ' + error.data); }
	} else {
		var results;
		studentsArray = new Array();
		var rows = xmldoc.getElementsByTagName('student');
//		if (debugC1) { alert('controller.js:  handleHttpGetAllStudents  --> ' + rows.length); }
		// loop through the students; at the end of the loop, each array entry will contain
		// an array with the fields from the db
		var i = 0;
		for (i = 0; i < rows.length; i++) {
			var info = new Array(8);
			info[ID] = rows[i].getElementsByTagName('studentid').item(0).firstChild.data;
			info[FIRST_NAME] = rows[i].getElementsByTagName('firstname').item(0).firstChild.data;
			info[LAST_NAME] = rows[i].getElementsByTagName('lastname').item(0).firstChild.data;
			
			studentsArray[i] = (info);
		}
		createNamesMenu();
	}
}

function getStudentsInClass(selectedClassID) {
	
	if (debugC1) { alert('controller.js:  getStudentsInClass(): ' + selectedClassID); }
	http.setRespHandler('getallstudents', handleHttpGetAllStudents);
	url = QUERY + '?task=getallstudents&courseid=' + selectedClassID;
	http.request(url);
}

function handleHttpGetAllStudents(xmldoc) {
	/*
	<student>
		<studentid></studentid>
		<firstname></firstname>
		<lastname></lastname>
		<sat></sat>
		<unsat></unsat>
		<failing></failing>
		<comments></comments>
	</student>
	*/
	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (error) {
		if (debugC1) { alert('controller.js:  handleHttpGetAllStudents returned error --> ' + error.data); }
		//	handleError(ERR_GETALLSTUDENTS, error.data);	
	} else {
		var results;
		studentsArray = new Array();
		var rows = xmldoc.getElementsByTagName('student');
		// loop through the students; at the end of the loop, each array entry will contain
		// an array with the fields from the db
		var i = 0;
		for (i = 0; i < rows.length; i++) {
			var info = new Array(8);
			info[ID] = rows[i].getElementsByTagName('studentid').item(0).firstChild.data;
			info[FIRST_NAME] = rows[i].getElementsByTagName('firstname').item(0).firstChild.data;
			info[LAST_NAME] = rows[i].getElementsByTagName('lastname').item(0).firstChild.data;
			info[OUTSTANDING_ITEM] = rows[i].getElementsByTagName('out').item(0).firstChild.data;
			info[SATISFACTORY_ITEM] = rows[i].getElementsByTagName('sat').item(0).firstChild.data;
			info[UNSATISFACTORY_ITEM] = rows[i].getElementsByTagName('unsat').item(0).firstChild.data;
			info[FAILING_ITEM] = rows[i].getElementsByTagName('failing').item(0).firstChild.data;
			info[COMMENTS_ITEM] = rows[i].getElementsByTagName('comments').item(0).firstChild.data;
			info[MODIFIED] = rows[i].getElementsByTagName('modified').item(0).firstChild.data;
			info[MODIFIED_BY] = rows[i].getElementsByTagName('modifiedby').item(0).firstChild.data;
			info[CODES] = rows[i].getElementsByTagName('codes').item(0).firstChild.data;
			
			studentsArray[i] = (info);
			var temp = studentsArray[i]
			if (debugC1) { alert("controller.js:  handleHttpGetAllStudents() studentsArray entry --> " + temp); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[ID] = " + temp[ID]); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[FIRST_NAME] = " + temp[FIRST_NAME]); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[LAST_NAME] = " + temp[LAST_NAME]); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[OUTSTANDING_ITEM] = " + temp[OUTSTANDING_ITEM]); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[SATISFACTORY_ITEM] = " + temp[SATISFACTORY_ITEM]); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[UNSATISFACTORY_ITEM] = " + temp[UNSATISFACTORY_ITEM]); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[FAILING_ITEM] = " + temp[FAILING_ITEM]); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[COMMENTS_ITEM] = " + temp[COMMENTS_ITEM]); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[MODIFIED] = " + temp[MODIFIED]); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[MODIFIED_BY] = " + temp[MODIFIED_BY]); }
			if (debugC2) { alert("controller.js:  handleHttpGetAllStudents() studentsArray[CODES] = " + temp[CODES]); }
		}
		createAllStudentEntries();
	}
}

function writeAllRecords(classid) {
	if (debugWriteAll) { alert('controller.js:  writeAllRecords called'); }
	var entryTable = document.getElementById('tabletwo');
	var entries = entryTable.rows;
	if (debugWriteAll) { alert('controller.js:  numrows = ' + entries.length); }
	var i = 0;
	for (i = 0; i < entries.length; i++) {
		var row = entries[i];
		if (row.className == 'modified' || row.className == 'active') {
			writeRecord(row.id, classid);
		}
	}
}

function writeRecord(idnum, classid) {

	currentStudentID = idnum;
	
	var outvalID = idnum + 'out';
	var satvalID = idnum + 'sat';
	var unsatvalID = idnum + 'unsat';
	var failvalID = idnum + 'failing';
	var commentsvalID = idnum + 'comments';
	var codesvalID = idnum + 'codes';
	
	var outval = (document.getElementById(outvalID).checked ? '1' : '0');
	var satval = (document.getElementById(satvalID).checked ? '1' : '0');
	var unsatval = (document.getElementById(unsatvalID).checked ? '1' : '0');
	var failval = (document.getElementById(failvalID).checked ? '1' : '0');
	var commentsval = document.getElementById(commentsvalID).value;	
	var codesval = document.getElementById(codesvalID).value;

	var submitScriptParams = "out=" + outval + "&sat=" + satval + "&unsat=" + unsatval + "&fail=" + failval + "&comments=" + escape(commentsval) + "&studentid=" + idnum + "&courseid=" + classid + "&teacherid=" + teacherid + "&codes=" + codesval;

	http.setRespHandler('writeback', handleHttpWriteRecord);
	url = QUERY + '?task=writeback&' + submitScriptParams;
	if (debugWrite) {alert('controller.js:  writeRecord():  ' + url.split('&'));}
	http.request(url);
}


/*
	buttons have ids [code number] + '+' or [code number] + '-'
	e.g., 9+ or 9-
	but all buttons have a .name attribute of 'codebutton'
*/

function gatherCodes() 
{
	allCodeInputs = document.getElementsByName('codebutton');
	var i;
	var codesval = "";
	for (i = 0; i < allCodeInputs.length; i++) {
		currentInput = allCodeInputs[i];
		if (currentInput.checked) {
			buttonName = currentInput.id;
/*			I just realize that I don't need this to write.  We will need to 
			parse the code string from the DB in this manner when we read and 
			want to figure out which buttons to fire.

			// slice(-1) gets just the last char
			// negative numbers evaluate from the right
			plusOrMinus = buttonName.slice(-1);
			codeNumber = buttonName.slice(0, -1);
*/
			codesval = codesval + buttonName + "|";
			currentInput.checked = false;
		}
	}
	if (debugNewButtons) { alert('codesval == ' + codesval); }
	return codesval;
}

function handleHttpWriteRecord(xmldoc) {
	
	/*
		return is
		true or false
	*/

	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (error) {
		if (debugdefaults) { alert('controller.js:  handleHttpDefaults returned error --> ' + error.data); }
		//	handleError(ERR_WRITERECORD, error.data);	
	} else {	
		affectedRows = xmldoc.getElementsByTagName('number');
		numRows = affectedRows.item(0).firstChild.data;
		if (debugWrite) { alert('controller.js:  handleHttpWriteRecord() returned with affectedRows = ' + numRows); }
		if ( numRows == '1') {
			studentID = xmldoc.getElementsByTagName('idnum').item(0).firstChild.data;
			if (debugWriteAll) { alert('controller.js:  handleHttpWriteRecord() success for studentID:  ' + studentID); }
			setRowStatus(studentID, EDITED_STATUS);
		} else { 
			if (debugerrorhandling) { alert('Error in handleHttpWriteRecord.  Number of rows affected:  ' + numRows); }
		//	handleError(ERR_WRITE_RECORD_NUM_ROWS, numRows);
		}
	}
}

function getInterimCommentCodes() 
{
	http.setRespHandler('getcodes', handleHttpGetCodes);
	url = QUERY + '?task=getcodes';
	http.request(url);
}

function handleHttpGetCodes(xmldoc) 
{
	if (debugcodes) { alert('controller.js:  handleHttpGetCodes() entry point with xmldoc:  ' + xmldoc + ' with ' + xmldoc.childNodes.length + ' nodes'); }

	error = xmldoc.getElementsByTagName('error').item(0).firstChild;
	if (error) {
		if (debugerrorhandling) { alert('controller.js:  handleHttpDefaults returned error --> ' + error.data); }
		//	handleError(ERR_GETCODES, error.data);	
	} else {	
		codesArray = new Array();
		var rows = xmldoc.getElementsByTagName('code');
		var i;
		for (i = 0; i < rows.length; i++) {
			info = new Array(2);
			info[CODE] = rows[i].getElementsByTagName('codeid').item(0).firstChild.data;
			info[TEXT] = rows[i].getElementsByTagName('text').item(0).firstChild.data;
			info[ORDER] = rows[i].getElementsByTagName('order').item(0).firstChild.data;
			if (debugcodes) { alert('controller.js:  handleHttpGetCodes():  ' + info); }
			codesArray.push(info);
		}  // end for-loop
	}
} // end function

function findDefaultWithKey(key)
{
	if (debugdefaults) { 
		alert('controller.js:  findDefaultWithKey:  finding ' + key);
	}
	var i, returnvalue;
	for (i = 0; i < defaultsArray.length; i++) {
		var tempdef = defaultsArray[i];
		if (tempdef[KEY].toLowerCase() == key.toLowerCase()) {
			returnvalue = tempdef[VALUE];
			if (debugdefaults) { 
				alert('controller.js:  findDefaultWithKey:  ' + returnvalue);
			}
		}
	}
	return returnvalue;
}

function edit() 
{
	getClasses();
}

function printQueryAdmin()
{
	clearContent();
	createPrintQueryScreen(SUPERUSER);
}

function showPrintAll()
{
	var keys = document.getElementById('sortkey');
	var selected = keys.selectedIndex;
	var sortkey = keys.options[selected].value;
	http.setRespHandler('getallrecords', handleHttpGetAllRecords);
	if (debugprint) { alert('showPrintAll(): ' + sortkey); }
	url = QUERY + '?task=getallrecords&key=' + sortkey;
	http.request(url);
}
