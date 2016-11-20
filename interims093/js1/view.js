function setupLogin()
{
	window.resizeTo(850, 700);
	if (debugV1) {alert('setupLogin() called');}
	clearMenus();
	clearFunctions();
	clearContent();
	getSeed();
	getDefaults();
	var sysmess = document.getElementById('systemmessages');
	sysmess.innerHTML = "";
	var usermess = document.getElementById('usermessage');
	usermess.innerHTML = "";
	setUpLoginPanel();
}

function clearContent() 
{
	var leftbox = document.getElementById('sidebar');
	leftbox.visibility = 'hidden';
	leftbox.innerHTML = "";

	var rightbox = document.getElementById('content');
	rightbox.visibility = 'hidden';
	rightbox.innerHTML = "";
}

function clearMenus() {
	var functionsPanel = document.getElementById('menu');
	functionsPanel.innerHTML = "";
}

function clearFunctions() {
	var functionsPanel = document.getElementById('functions');
	functionsPanel.innerHTML = "";
}

function setUpLoginPanel()
{
	var loginPanel = document.getElementById('login');
	loginPanel.innerHTML = "";
	if (debugV1) {alert('getElementById:  ' + loginPanel);}

	var loginform = document.createElement('form');
	loginform.setAttribute('id', 'loginform');
	loginform.setAttribute('action', 'javascript:validateLogin()');
	
	var messagediv=document.createElement("div");
	messagediv.setAttribute("id", "message");
   	messagediv.setAttribute("class", "generaltext");
	messagedivText = document.createTextNode('Enter your username and password.');
	messagediv.appendChild(messagedivText);

	var usernameinputlabel = document.createElement('label');
	usernameinputlabel.setAttribute("for", "username");
	usernameinputlabel.setAttribute("id", "usernamelabel");
	usernameinputlabel.setAttribute("class", "generaltext");
	var usernameinputlabeltext = document.createTextNode('Username:     ');
	usernameinputlabel.appendChild(usernameinputlabeltext);
	
	var usernameinput = document.createElement('input');
	usernameinput.setAttribute("type", "text");
	usernameinput.setAttribute("name", "username");
	usernameinput.setAttribute("id", "username");
	usernameinput.setAttribute("tabindex", "1");
	usernameinput.setAttribute("size", "12");
	
	var passwordinputlabel = document.createElement('label');
	passwordinputlabel.setAttribute("for", "password");
	passwordinputlabel.setAttribute("id", "passwordlabel");
	passwordinputlabel.setAttribute("class", "generaltext");
	var passwordinputlabeltext = document.createTextNode('Password:     ');
	passwordinputlabel.appendChild(passwordinputlabeltext);
	
	var passwordinput = document.createElement('input');
	passwordinput.setAttribute("type", "password");
	passwordinput.setAttribute("name", "password");
	passwordinput.setAttribute("tabindex", "2");
	passwordinput.setAttribute("id", "password");
	passwordinput.setAttribute("size", "10");
	
	// create the submit button
	var linebreak = document.createElement('br');
	var submit = document.createElement('input');
	submit.setAttribute('type', 'button');
	submit.setAttribute('tabindex', "3");
	submit.setAttribute('value', 'LOGIN');
	submit.setAttribute('onclick', 'validateLogin()');
	
	loginform.appendChild(messagediv);
	loginform.appendChild(usernameinputlabel);
	loginform.appendChild(usernameinput);
	loginform.appendChild(passwordinputlabel);
	loginform.appendChild(passwordinput);
	loginform.appendChild(submit);
	
	loginPanel.appendChild(loginform);

	messageElement = false;
	showingLoggedIn = false;

}


function showLogin() {
	if (messageElement != false)
	{
		try {
			document.getElementById('message').removeChild(messageElement);
		}
		catch (e) { }
	}
	if (loggedIn)
	{
		if (debugV1) { alert("user logged in..."); }
		showingLoggedIn = true;
		
		var loginPanel = document.getElementById('login');
		// create a paragraph element
		var p = document.createElement('div');
		p.setAttribute('class', 'generaltext');
		var pre = document.createTextNode('Logged in as ');
		var strong = document.createElement('strong');
		strong_text = document.createTextNode(fullname);
		strong.appendChild(strong_text);
		var mid = document.createTextNode(' [');
		var a = document.createElement('a');
		a.href="javascript:logout()";
		a_text = document.createTextNode('logout');
		a.appendChild(a_text);
		var post = document.createTextNode(']');
		
		p.appendChild(pre);
		p.appendChild(strong);
		p.appendChild(mid);
		p.appendChild(a);
		p.appendChild(post);
		
		loginPanel.appendChild(p);

		var loginform = document.getElementById('loginform');
		loginPanel.removeChild(loginform);
		// if there is a message to users, now you can display it
		setupSystemMessages();
		// if there is a personal message to the logged in user, display that
		setupUserMessages();
		setupMainMenu();
	}
	else
	{
		var messageElement = document.createElement('strong');
		messageElement.appendChild(document.createTextNode(' ' + messages));
		messageElement.style.color = '#ff0000';
		document.getElementById('message').appendChild(messageElement);
	}
}


function setupUserMessages() {
		// set up the message, if any
		var p1 = document.getElementById('usermessage');
		var intro = document.createElement('div');
		intro.setAttribute('class', 'message');
		var login = new Date();
		login.setTime(lastlogin*1000);
		if (debugV5) { alert('setupUserMessages():  lastlogin->' + lastlogin + '; login -> ' + login.toLocaleString()); }
		intro.appendChild(document.createTextNode('Last Login:  ' + login.toLocaleString()));
		intro.appendChild(document.createElement('br'));
		intro.appendChild(document.createTextNode('User Message:  ' + usermessage));
		p1.appendChild(intro);		
}

function setupSystemMessages()
{
	// put system information and any systemwide messages out
	var m = new String(findDefaultWithKey(MESSAGES_KEY));
	if (m == "undefined") { m = "Welcome to the Interims System."; }
	var target = document.getElementById('systemmessages');
	var linebreak = document.createElement('br');
	var intro = document.createElement('div');
	intro.setAttribute('class', 'message');
	intro.appendChild(document.createTextNode('System Message:  '));
	intro.appendChild(document.createTextNode(m));
	target.appendChild(intro);
}

// logout method: prepares for a new login
function logout()
{
	resetLogin();
	setupLogin();
}


// sets up the main function menu, according to the user's privilege level.
function setupMainMenu() {

	var menuPanel = document.getElementById('menu');
	if (debugV1) { alert('(privileges & VIEW_PERMISSION) == (' + privileges + ' & ' + VIEW_PERMISSION + ') == ' + (privileges & VIEW_PERMISSION)); }
	if ((privileges & VIEW_PERMISSION) == VIEW_PERMISSION) {
		var mid1 = document.createTextNode(' [');
		var a1 = document.createElement('a');
		a1.href="javascript:showInterimsFunctions()";
		var a1_text = document.createTextNode('Interims System');
		a1.appendChild(a1_text);
		var post1 = document.createTextNode(']');
			
		menuPanel.appendChild(mid1);
		menuPanel.appendChild(a1);
		menuPanel.appendChild(post1);
	}
	
	if (debugV1) { alert('(privileges & SINGLE_ACCOUNT_ADMIN) == (' + privileges + ' & ' + SINGLE_ACCOUNT_ADMIN + ') == ' + (privileges & SINGLE_ACCOUNT_ADMIN)); }
	if ((privileges & SINGLE_ACCOUNT_ADMIN) == SINGLE_ACCOUNT_ADMIN) {
		var mid2 = document.createTextNode(' [');
		var a2 = document.createElement('a');
		a2.href="javascript:showAccountFunctions()";
		var a2_text = document.createTextNode('Account');
		a2.appendChild(a2_text);
		var post2 = document.createTextNode(']');
			
		menuPanel.appendChild(mid2);
		menuPanel.appendChild(a2);
		menuPanel.appendChild(post2);
	}

	if (debugV1) { alert('(privileges & SUPERUSER) == (' + privileges + ' & ' + SUPERUSER + ') == ' + (privileges & SUPERUSER)); }
	if ((privileges & SUPERUSER) == SUPERUSER) {
		var mid3 = document.createTextNode(' [');
		var a3 = document.createElement('a');
		a3.href="javascript:showAdminFunctions()";
		var a3_text = document.createTextNode('Admin');
		a3.appendChild(a3_text);
		var post3 = document.createTextNode(']');
			
		menuPanel.appendChild(mid3);
		menuPanel.appendChild(a3);
		menuPanel.appendChild(post3);
	}
}

function showAccountFunctions() {

	clearFunctions();	
	clearContent();
	
	var mid = document.createTextNode(' [');
	var a = document.createElement('a');
	a.href="javascript:editPassword()";
	var a_text = document.createTextNode('Change Password');
	a.appendChild(a_text);
	var post = document.createTextNode(']');
		
	var menuPanel = document.getElementById('functions');
	menuPanel.appendChild(mid);
	menuPanel.appendChild(a);
	menuPanel.appendChild(post);
}

function showInterimsFunctions() {

	clearFunctions();
	clearContent();

	var mid = document.createTextNode(' [');
	var a = document.createElement('a');
	a.href="javascript:edit()";
	a.id = 'editcommand';
	var a_text = document.createTextNode('Edit');
	a.appendChild(a_text);
	var post = document.createTextNode(']');
		
		
	var menuPanel = document.getElementById('functions');
	menuPanel.appendChild(mid);
	menuPanel.appendChild(a);
	menuPanel.appendChild(post);
	
}

function showAdminFunctions() {
	
	clearFunctions();
	clearContent();
	
	var mid = document.createTextNode(' [');
	var a = document.createElement('a');
	a.href="javascript:editUsers()";
	var a_text = document.createTextNode('Edit Users');
	a.appendChild(a_text);
	var post = document.createTextNode(']');
	
	
	var mid3 = document.createTextNode(' [');
	var a3 = document.createElement('a');
	a3.href="javascript:editQuery()";
	var a3_text = document.createTextNode('Edit');
	a3.appendChild(a3_text);
	var post3 = document.createTextNode(']');

	var menuPanel = document.getElementById('functions');
	menuPanel.appendChild(mid3);
	menuPanel.appendChild(a3);
	menuPanel.appendChild(post3);
	
	
	var mid1 = document.createTextNode(' [');
	var a1 = document.createElement('a');
	a1.href="javascript:viewQuery()";
	var a1_text = document.createTextNode('View');
	a1.appendChild(a1_text);
	var post1 = document.createTextNode(']');
	
	menuPanel.appendChild(mid1);
	menuPanel.appendChild(a1);
	menuPanel.appendChild(post1);

	mid2 = document.createTextNode(' [');
	a2 = document.createElement('a');
	a2.href="javascript:printQueryAdmin()";
	a2_text = document.createTextNode('Print');
	a2.appendChild(a2_text);
	post2 = document.createTextNode(']');
		
	menuPanel.appendChild(mid2);
	menuPanel.appendChild(a2);
	menuPanel.appendChild(post2);

}

function createClassesMenu() {

	var menuPanel = document.getElementById('functions');
	var classesMenu = document.getElementById('classes');
	
	// if the menu already exists, get rid of it and start fresh
	if (classesMenu) {
		menuPanel.removeChild(classesMenu);
	}
	
	if (debugV1) { 
		alert("createClassesMenu():  coursesArray (" + coursesArray.length + ") --> " + coursesArray.toString()) 
		alert("createClassesMenu():  menuPanel --> " + menuPanel) 
	};
	
	var classes = document.createElement('select');
	if (debugV1) { alert("createClassesMenu():  classes --> " + classes) };
	classes.id = 'classes';
	classes.onchange = function() { editWithClass(); }
	var newOption = document.createElement('option');
	newOption.value = 'none';
	newOption.selected = 'selected';
	newOption.text = '<-- Select a Course -->';
	try {
		classes.add(newOption, null); // standards compliant; doesn't work in IE
	}
	catch(ex) {
		classes.add(newOption); // IE only
	}
	var i = 0;
	for (i=0; i < coursesArray.length; i++) {
		if (debugV1) { alert('createClassesMenu():  adding option for --> ' + coursesArray[i]); }
		courseInfo = coursesArray[i];
		newOption = document.createElement('option');
		// take off the quotation marks from the title string
		courseTitleText = courseInfo[COURSETITLE];
		if (debugV1) { alert('editInterims():  creating new option with:  ' + courseInfo[COURSEID] + ":" + courseTitleText); }
		newOption.value = courseInfo[0];
		newOption.text = courseTitleText;
		try {
			classes.add(newOption, null); // standards compliant; doesn't work in IE
		}
		catch(ex) {
			classes.add(newOption); // IE only
		}
	}
	menuPanel.appendChild(classes);
}

function createNamesMenu() {
	var side = document.getElementById('sidebar');
	// this will change to a tabbed interface eventually...
	var nametable = document.createElement('table');
	nametable.className = 'nametable';
	nametable.setAttribute('summary', 'Student Names');

	var i = 0;
	systemopens = new Date().setTime(findDefaultWithKey(OPENS_KEY));
	for (i = 0; i < studentsArray.length; i++) {
		nametable.appendChild(createStudentNameRow(i));
	}
	
	side.appendChild(nametable);

}

function createStudentNameRow(index) {
	var studentinfo = studentsArray[index];
	var id = studentinfo[ID];
	var row = document.createElement('tr');
	row.setAttribute('id', id);
	var classes = document.getElementById('classes');
	var selectedOption = classes.selectedIndex;
	var classid = classes.options[selectedOption].value;
	row.onclick = new function() { openStudentRecord(classid, id); }
	
	var c1 = document.createElement('td');
	c1.appendChild(document.createTextNode(studentinfo[LAST_NAME] + ", " + studentinfo[FIRST_NAME]));
	idnode = document.createElement('div');
	idnode.className = 'idnumber';
	idnodetext = document.createTextNode('(ID:  ' + id + ')');
	idnode.appendChild(idnodetext);
	c1.appendChild(idnode);
}

/* function createAllStudentEntries() { */
/*  */
/* 	if (debugV2) { alert('createAllStudentEntries() entry point'); } */
/* 	codesbox = document.getElementById('codesbox'); */
/* 	codesbox.style.visibility = 'visible'; */
/* 	var mb = document.getElementById('midbox'); */
/* 	mbstyle = mb.style; */
/* 	mbstyle.visibility = 'visible'; */
/* 	if (debugV2) { alert('createAllStudentEntries() midbox = ' + mb); } */
/*  */
/* 	var entrytable = document.createElement('table'); */
/* 	entrytable.setAttribute('class', 'entrytable'); */
/* 	entrytable.setAttribute('summary', 'Student Interim Records'); */
/* 	 */
/* 	var caption = document.createElement('caption'); */
/* 	var captionText = "Student Interims for "; */
/*  	var captionCourseName = document.createElement('span'); */
/*  	captionCourseName.setAttribute('class', 'coursename');  */
/*  	 */
/*  	captionCourseName.appendChild(document.createTextNode(currentClassName)); */
/*  	var captionTeacherName = document.createTextNode(' (' + fullname + ')'); */
/* 	caption.appendChild(document.createTextNode(captionText)); */
/* 	caption.appendChild(captionCourseName); */
/* 	caption.appendChild(captionTeacherName); */
/* 	entrytable.appendChild(caption); */
/*  */
/* 	var head = document.createElement('thead'); */
/* 	var headrow = document.createElement('tr');	 */
/*  */
/* 	var hcol1 = document.createElement('th'); */
/* 	hcol1.setAttribute('scope', 'col'); */
/* 	hcol1.setAttribute('class', 'th1');	 */
/* 	hcol1.appendChild(document.createTextNode('Student')); */
/*  */
/* 	var hcol2a = document.createElement('th'); */
/* 	hcol2a.setAttribute('scope', 'col'); */
/* 	hcol2a.setAttribute('class', 'th2');	 */
/* 	hcol2a.appendChild(document.createTextNode('Outs')); */
/*  */
/* 	var hcol2 = document.createElement('th'); */
/* 	hcol2.setAttribute('scope', 'col'); */
/* 	hcol2.setAttribute('class', 'th2');	 */
/* 	hcol2.appendChild(document.createTextNode('Sat')); */
/*  */
/* 	var hcol3 = document.createElement('th'); */
/* 	hcol3.setAttribute('scope', 'col'); */
/* 	hcol3.setAttribute('class', 'th3');	 */
/* 	hcol3.appendChild(document.createTextNode('Unsat')); */
/*  */
/* 	var hcol4 = document.createElement('th'); */
/* 	hcol4.setAttribute('scope', 'col'); */
/* 	hcol4.setAttribute('class', 'th4');	 */
/* 	hcol4.appendChild(document.createTextNode('Fail')); */
/*  */
/* 	var hcol5 = document.createElement('th'); */
/* 	hcol5.setAttribute('scope', 'col'); */
/* 	hcol5.setAttribute('class', 'th5');	 */
/* 	hcol5.appendChild(document.createTextNode('Comments')); */
/*  */
/* 	headrow.appendChild(hcol1); */
/* 	headrow.appendChild(hcol2a); */
/* 	headrow.appendChild(hcol2); */
/* 	headrow.appendChild(hcol3); */
/* 	headrow.appendChild(hcol4); */
/* 	headrow.appendChild(hcol5); */
/* 	head.appendChild(headrow); */
/* 	entrytable.appendChild(head); */
/*  */
/* 	var foot = document.createElement('tfoot'); */
/* 	var footrow = document.createElement('tr'); */
/*  */
/* 	var fcol1 = document.createElement('th'); */
/* 	fcol1.setAttribute('scope', 'row'); */
/* 	fcol1.appendChild(document.createTextNode('Total')); */
/*  */
/* 	var fcol2 = document.createElement('td'); */
/* 	fcol2.setAttribute('colspan', '3'); */
/* 	fcol2text = studentsArray.length + (studentsArray.length == 1 ? ' student' : ' students'); */
/* 	fcol2.appendChild(document.createTextNode(fcol2text)); */
/*  */
/* 	var fcol3 = document.createElement('td'); */
/* 	fcol3.setAttribute('colspan', '2'); */
/* 	var submitAllLink = document.createElement('a'); */
/* 	var submitAllLinkHREF = 'javascript:writeAllRecords(\'' + currentClassID + '\')'; */
/* 	submitAllLink.setAttribute('href', submitAllLinkHREF); */
/* 	submitAllLink.appendChild(document.createTextNode('SUBMIT ALL ENTRIES')); */
/* 	fcol3.appendChild(submitAllLink); */
/*  */
/* 	footrow.appendChild(fcol1); */
/* 	footrow.appendChild(fcol2); */
/* 	footrow.appendChild(fcol3); */
/* 	foot.appendChild(footrow); */
/* 	entrytable.appendChild(foot); */
/* 	 */
/* 	// the tbody is a single row containing a nested table with the student entries */
/* 	var body = document.createElement('tbody');	 */
/* 	bodyRow = document.createElement('tr'); */
/* 	bodyRowCol = document.createElement('td'); */
/* 	bodyRowCol.setAttribute('colspan', '6'); */
/* 	 */
/* 	bodyRow.appendChild(bodyRowCol); */
/* 	body.appendChild(bodyRow); */
/* 	entrytable.appendChild(body); */
/* 	 */
/* 	// inner table begins here */
/* 	innerTableDiv = document.createElement('div'); */
/* 	innerTableDiv.setAttribute('class', 'innerb'); */
/* 	bodyRowCol.appendChild(innerTableDiv); */
/* 	 */
/* 	innertable = document.createElement('table'); */
/* 	innertable.setAttribute('class', 'tabletwo'); */
/* 	innertable.setAttribute('id', 'tabletwo'); */
/* 	innerTableDiv.appendChild(innertable); */
/* 		 */
/* 	innerTBody = document.createElement('tbody'); */
/* 	innertable.appendChild(innerTBody); */
/* 	var i = 0; */
/* 	// OPENS_KEY will return unix millis */
/* 	systemopens = new Date().setTime(findDefaultWithKey(OPENS_KEY)); */
/* 	for (i = 0; i < studentsArray.length; i++) { */
/* 		innerTBody.appendChild(createStudentRow(i, studentsArray[i]));		 */
/* 	} */
/* 	// inner table ends here */
/*  */
/* 	mb.appendChild(entrytable); */
/* } */

/*
	function creates a row containing student information
	c1 = student name & id
	c2 = 

*/

function createStudentRow(firstindex, studentinfo)
{

	var id = studentinfo[ID];
	var inputSize = 25;
	
	var row = document.createElement('tr');
	row.setAttribute('id', id);
	row.setAttribute('onclick', 'setRowStatus(' + id + ', 3)');
	rowchangecall = 'setRowStatus(' + id + ', false)';

	var c1 = document.createElement('td');
	c1.setAttribute('class', 'td1');
	c1.setAttribute('scope', 'row');
	c1.appendChild(document.createTextNode(studentinfo[LAST_NAME] + ", " + studentinfo[FIRST_NAME]));
	idnode = document.createElement('div');
	idnode.setAttribute('class', 'idnumber');
	idnodetext = document.createTextNode('(ID:  ' + id + ')');
	idnode.appendChild(idnodetext)
	c1.appendChild(idnode);

	var c2a = document.createElement('td');
	c2a.setAttribute('class', 'td2');
	c2ainput = document.createElement('input');
	c2ainput.setAttribute('type', 'checkbox');
	c2ainput.setAttribute('id', id + 'out');
	// formula is 4x+1 to generate proper index....
	c2ainput.setAttribute('tabindex', firstindex * 4 + 1);
	c2ainput.checked = (studentinfo[OUTSTANDING_ITEM] == 1 ? true : false);
	c2ainput.setAttribute('onchange', rowchangecall);
	c2a.appendChild(c2ainput);

	
	var c2 = document.createElement('td');
	c2.setAttribute('class', 'td2');
	c2input = document.createElement('input');
	c2input.setAttribute('type', 'checkbox');
	c2input.setAttribute('id', id + 'sat');
	// formula is 4x+1 to generate proper index....
	c2input.setAttribute('tabindex', firstindex * 4 + 2);
	c2input.checked = (studentinfo[SATISFACTORY_ITEM] == 1 ? true : false);
	c2input.setAttribute('onchange', rowchangecall);
	c2.appendChild(c2input);

	var c3 = document.createElement('td');
	c3.setAttribute('class', 'td3');
	c3input = document.createElement('input');
	c3input.setAttribute('type', 'checkbox');
	c3input.setAttribute('id', id + 'unsat');
	// formula is 4x+2 to generate proper index....
	c3input.setAttribute('tabindex', firstindex * 4 + 3);
	c3input.checked = (studentinfo[UNSATISFACTORY_ITEM] == 1 ? true : false);
	c3input.setAttribute('onchange', rowchangecall);
	c3.appendChild(c3input);

	var c4 = document.createElement('td');
	c4.setAttribute('class', 'td4');
	c4input = document.createElement('input');
	c4input.setAttribute('type', 'checkbox');
	c4input.setAttribute('id', id + 'failing');
	// formula is 4x+3 to generate proper index....
	c4input.setAttribute('tabindex', firstindex * 4 + 4);
	c4input.checked = (studentinfo[FAILING_ITEM] == 1 ? true : false);
	c4input.setAttribute('onchange', rowchangecall);
	c4.appendChild(c4input);

	var c5 = document.createElement('td');
	c5.setAttribute('class', 'td5');
	c5input = document.createElement('input');
	c5input.setAttribute('type', 'text');
	c5input.setAttribute('size', 50);
	c5input.setAttribute('id', id + 'comments');
	// formula is 4x+4 to generate proper index....
	c5input.setAttribute('tabindex', firstindex * 4 + 5);
	c5input.setAttribute('maxlength', '150');
	c5input.setAttribute('class', 'formtext');
	c5input.setAttribute('value', studentinfo[COMMENTS_ITEM]);
	c5input.setAttribute('onchange', rowchangecall);
	c5.appendChild(c5input);
	
	var c5codes = document.createElement('input');
	c5codes.setAttribute('type', 'hidden');
	c5codes.id = id + 'codes';
	c5codes.value = studentinfo[CODES];
	c5.appendChild(c5codes);
	
	row.appendChild(c1);
	row.appendChild(c2a);
	row.appendChild(c2);
	row.appendChild(c3);
	row.appendChild(c4);
	row.appendChild(c5);

	// MODIFIED returns unix millis
	var recordModified = new Date().setTime(studentinfo[MODIFIED]);
	if (debugV4) {
		alert('createStudentRow():  recordModified-> ' + recordModified + '; systemopens-> ' + systemopens);
	}
	
	// QUERY:  should this use the setRowStatus method?
	if (recordModified > systemopens) {
		row.setAttribute('class', 'edited');
	} else {
		row.setAttribute('class', 'unedited');
	}
	
	return row;

}


/*
	status:  edited (GREEN --> OK, finished); modified (YELLOW --> unsaved); or unedited (RED --> untouched)
	
	also does some client-side checking.

*/

function setRowStatus(rowID, status)
{
	var currentrow = document.getElementById(rowID);
	
	oset = document.getElementById(rowID + 'out');
	sset = document.getElementById(rowID + 'sat');
	uset = document.getElementById(rowID + 'unsat');
	fset = document.getElementById(rowID + 'failing');
	comm = document.getElementById(rowID + 'comments');
	
	setcount = 0;
	if (oset.checked) setcount++;
	if (sset.checked) setcount++;
	if (uset.checked) setcount++;
	if (fset.checked) setcount++;
	
	if (setcount > 1) {
		alert('Error:  only one value may be set for student progress');
		oset.checked = false;
		sset.checked = false;
		uset.checked = false;
		fset.checked = false;
		currentrow.className = 'active';
	} else {
		if (status == EDITED_STATUS) {
			currentrow.className = 'edited';
		} else if (status == MODIFIED_STATUS) {
			currentrow.className = 'modified';
		} else if (status == ACTIVE_STATUS) {
			setAllStudentRowsInactive();
			setStudentRowActive(rowID);
		}
	}
	if (debugV3) { alert('setRowStatus:  ' + currentrow + ',' + idnum + ',' + currentrow.className); }
}

function setAllStudentRowsInactive() 
{
	var t = document.getElementById('tabletwo');
	var i;
	for (i = 0; i < t.rows.length; i++) {
		currRow = t.rows[i];
		// if the className contains the word 'active' in it, then this is the active row
		if (currRow.className == 'active') {
			setStudentRowInactive(currRow);
		}
	}
}

function setStudentRowInactive(row) 
{
	// gather up the codes, store them, and set all to unchecked
	var codesval = gatherCodes();
	if (debugNewButtons) { alert('student row ' + row.id + ' requests inactive status with codes ' + codesval); }
	var codesfield = document.getElementById(row.id + 'codes');
	codesfield.value = codesval;
	// set the row to modified
	setRowStatus(row.id, MODIFIED_STATUS);
}

function setStudentRowActive(rowID) 
{
	var row = document.getElementById(rowID);
	row.className = 'active';
	// gather up codes from the hidden field and set the buttons appropriately...
	codesstring = document.getElementById(rowID + 'codes').value
	codesarray = codesstring.split('|');
	allCodeInputs = document.getElementsByName('codebutton');
	var i, j;
	for (i = 0; i < codesarray.length; i++) {
		for (j = 0; j < allCodeInputs.length; j++) {
			currentInput = allCodeInputs[j]
			if (codesarray[i] == currentInput.id) {
				currentInput.checked = true;
			} else {
				currentInput = false;
			}
		}
	}
}


function createInterimCommentCodes() {
	codesbox = document.getElementById('codesbox');

	// create 4 separate tables to mimic columns
	codestable = document.createElement('table');
	codestable.setAttribute('class', 'codestable');
	codestable.setAttribute('summary', 'Interim Codes');
	caption = codestable.createCaption();
	caption.id = "codestitle";
	caption.innerHTML = 'Interim Codes';
	
	// each column will have a table of codes
	mainrow = codestable.insertRow(0);
	col4 = mainrow.insertCell(0);
	col3 = mainrow.insertCell(0);
	col2 = mainrow.insertCell(0);
	col1 = mainrow.insertCell(0);
	
	col1table = document.createElement('table');
	col2table = document.createElement('table');
	col3table = document.createElement('table');
	col4table = document.createElement('table');
	
	setUpTable(col1table, 1, 0, 7);
	setUpTable(col2table, 1, 8, 15);
	setUpTable(col3table, 1, 16, 21);
	setUpTable(col4table, 0, 22, 28);
	
	col4.appendChild(col4table, 1);
	col3.appendChild(col3table, 1);
	col2.appendChild(col2table, 1);
	col1.appendChild(col1table, 0);
	
	codesbox.appendChild(codestable);
}


function setUpTable(table, rightborder, dataBegin, dataEnd)
{
	table.setAttribute('summary', 'Interim Codes');
	if (rightborder) {
		table.style.borderRight = '2px solid';
	}
	table.width = '100%';
	head = table.createTHead();
	headerrow = head.insertRow(0);
	headerrow.setAttribute('class', 'codesheaders');
	plus = headerrow.insertCell(0);
	plus.setAttribute('class', 'strength');
	plus.innerHTML = "+";
	message = headerrow.insertCell(0);
	message.innerHTML = "Message";
	minus = headerrow.insertCell(0);
	minus.innerHTML = "-";
	plus.setAttribute('class', 'codesheaders');
	message.setAttribute('class', 'codesheaders');
	minus.setAttribute('class', 'codesheaders');

	body = document.createElement('tbody');
	table.appendChild(body);
	
	var i;
	if (debugcodes1) { alert('creating codes record with dataBegin:  ' + dataBegin + '; dataEnd:  ' + dataEnd); }	
	
	// these have been switched to checkboxes until i can research toggle buttons
	for (i = dataEnd; i >= dataBegin; i--) {
		if (i < codesArray.length) {
			currCode = codesArray[i];
			if (debugcodes1) { alert('creating record for:  ' + currCode); }
			row = body.insertRow(0);
			plus = row.insertCell(0);
			plusButton = document.createElement('input');
			plusButton.setAttribute('type', 'radio');
			plusButton.className = 'pbutton';
			plusButton.name = currCode[CODE];
			plusButton.id = currCode[CODE] + '+';
			plus.appendChild(plusButton);
			message = row.insertCell(0);
			message.innerHTML = currCode[TEXT];
			minus = row.insertCell(0);
			minusButton = document.createElement('input');
			minusButton.setAttribute('type', 'radio');
			minusButton.name = currCode[CODE];
			minusButton.className = 'mbutton';
			minusButton.id = currCode[CODE] + '-';
			minus.appendChild(minusButton);
		}
	}
}

function createPrintQueryScreen(userType) 
{
	if (debugprint) { alert('createPrintQueryScreen called with usertype:  ' + userType); }
	if (userType == SUPERUSER) {
		var queryDiv = document.getElementById('codesbox');
/* 		var labelspan = document.createElement('span'); */
/* 		labelspan.setAttribute('class','subtext'); */
/* 		var labeltext = document.createTextNode('Sort reports by:'); */
/* 		labelspan.appendChild(labeltext); */
/* 		queryDiv.appendChild(labelspan); */
/* 		var sortKey = document.createElement('select'); */
/* 		sortKey.id = 'sortkey'; */
/* 		sortKey.onchange = function() { showPrintAll(); } */
/* 		var newOption = document.createElement('option'); */
/* 		newOption.value = 'none'; */
/* 		newOption.selected = 'selected'; */
/* 		newOption.text = '<--- Sort Interims By -->'; */
/* 		try { */
/* 			sortKey.add(newOption, null); */
/* 		} catch(ex) { */
/* 			sortKey.add(newOption); 	// ie only */
/* 		} */
/* 		var sortKeys = new Array(new Array("advisory", "Advisory (numeric)"), new Array("student", "Student (alpha by last name)"), new Array("teacher", "Teacher (alpha by last name)")); */
/* 		var i = 0; */
/* 		for (i = 0; i < sortKeys.length; i++) { */
/* 			newOption = document.createElement('option'); */
/* 			keyinfo = sortKeys[i]; */
/* 			newOption.value = keyinfo[0]; */
/* 			newOption.text = keyinfo[1]; */
/* 			try { */
/* 				sortKey.add(newOption, null); */
/* 			} catch(ex) { */
/* 				sortKey.add(newOption); 	// ie only */
/* 			} */
/* 		} */
/* 		queryDiv.appendChild(sortKey); */
		var label = document.createElement('span');
		label.setAttribute('class', 'subtext');
		label.appendChild(document.createTextNode("Student Name Search"));
		queryDiv.appendChild(label);
		var namebox = document.createElement('input');
//		namebox

		queryDiv.style.visibility = 'visible';
	}
}