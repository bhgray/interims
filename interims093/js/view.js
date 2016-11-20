function clearMessages() {
	var sysmess = document.getElementById('systemmessages');
	sysmess.innerHTML = "";
	var usermess = document.getElementById('usermessage');
	usermess.innerHTML = "";
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

function clearContentPanel() 
{
	document.getElementById('content').innerHTML = "";
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
	if (debugLoginView) {alert('getElementById:  ' + loginPanel);}

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

}

function showLogin() {
	if (loggedIn)
	{
		if (debugLoginView) { alert("user logged in..."); }
		
		var loginPanel = document.getElementById('login');
		// create a paragraph element
		var p = document.createElement('div');
		p.setAttribute('class', 'generaltext');
		var pre = document.createTextNode('Logged in as ');
		var strong = document.createElement('strong');
		strong_text = document.createTextNode(user.name);
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
		login.setTime(user.lastLogin*1000);
		if (debugLoginView) { alert('setupUserMessages():  lastlogin->' + user.lastLogin + '; login -> ' + login.toLocaleString()); }
		intro.appendChild(document.createTextNode('Last Login:  ' + login.toLocaleString()));
		intro.appendChild(document.createElement('br'));
		intro.appendChild(document.createTextNode('User Message:  ' + user.userMessage));
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

function setupMainMenu() {

	var menuPanel = document.getElementById('menu');
	if (debugMenuView) { alert('(privileges & VIEW_PERMISSION) == (' + user.privileges + ' & ' + VIEW_PERMISSION + ') == ' + (user.privileges & VIEW_PERMISSION)); }
	if ((user.privileges & VIEW_PERMISSION) == VIEW_PERMISSION) {
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
	
	if (debugMenuView) { alert('(privileges & SINGLE_ACCOUNT_ADMIN) == (' + user.privileges + ' & ' + SINGLE_ACCOUNT_ADMIN + ') == ' + (user.privileges & SINGLE_ACCOUNT_ADMIN)); }
	if ((user.privileges & SINGLE_ACCOUNT_ADMIN) == SINGLE_ACCOUNT_ADMIN) {
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

	if (debugMenuView) { alert('(privileges & SUPERUSER) == (' + user.privileges + ' & ' + SUPERUSER + ') == ' + (user.privileges & SUPERUSER)); }
	if ((user.privileges & SUPERUSER) == SUPERUSER) {
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
	a.href="javascript:editClassesMenu()";
	a.id = 'editcommand';
	var a_text = document.createTextNode('Edit');
	a.appendChild(a_text);
	var post = document.createTextNode(']');
		
		
	var menuPanel = document.getElementById('functions');
	menuPanel.appendChild(mid);
	menuPanel.appendChild(a);
	menuPanel.appendChild(post);
	
}

function editClassesMenu() {
	getCodes();
	getClasses();
}

function createClassesMenu() {

	var menuPanel = document.getElementById('functions');
	var classesMenu = document.getElementById('classes');
	
	// if the menu already exists, get rid of it and start fresh
	if (classesMenu) {
		menuPanel.removeChild(classesMenu);
	}
	
	if (debugClassesMenu) { 
		alert("createClassesMenu():  coursesArray (" + user.courses.length + ") --> " + user.courses.toString());
		alert("createClassesMenu():  menuPanel --> " + menuPanel);
	};
	
	var classes = document.createElement('select');
	if (debugClassesMenu) { alert("createClassesMenu():  classes --> " + classes) };
	classes.id = 'classes';
	classes.onchange = function() { editClassInterims(); }
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
	for (var i in user.courses) {
		if (debugClassesMenu) { alert('createClassesMenu():  adding option for --> ' + user.courses[i]); }
		newOption = document.createElement('option');
		// take off the quotation marks from the title string
		newOption.value = i;
		newOption.text = user.courses[i];
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
	if (debugStudentNames && studentsArray.length > 0) {alert('view.js :: createNamesMenu() :: invocation')}
	sidebar = document.getElementById('sidebar');
	namesTable = document.createElement('table');
	namesTable.className = 'namestable';
	namesTable.id = 'ntable';
	namesTable.summary = 'Student Names';
	
	for (var i in studentsArray) {
		if (debugStudentNames) { alert('view.js :: createNamesMenu() for ' + studentsArray[i].id);}
		newRow = document.createElement('tr');
		newCell = document.createElement('td');
		newCell.id = i;
		if( studentsArray[i].modified > findDefaultWithKey(OPENS_KEY)) {
			newRow.className = 'modified';
		} else {
			newRow.className = 'unedited';
		}
		nameText = document.createTextNode(studentsArray[i].name);
		nameText.className = 'idnumber';
		idText = document.createTextNode('(ID: ' + i + ')');
		idText.className = 'idnumber';
		newCell.appendChild(nameText);
		newCell.appendChild(document.createElement('br'));
		newCell.appendChild(idText);
		newRow.appendChild(newCell);
		newRow.id = i;
		// figure out what class is selected to send to getStudentInterim(studentID, classID)
		classes = document.getElementById('classes');
		selectedOption = classes.selectedIndex;
		selectedClassID = classes.options[selectedOption].value;
		// set the onclick property to call the function
		newRow.setAttribute('onclick', "getStudentInterim(" + i + ", '" + selectedClassID + "')");
		namesTable.appendChild(newRow);
	}
	sidebar.appendChild(namesTable);
	
}

function createInterimEditPane(studentInfo) {
	clearContentPanel();
	// todo: change color of actively edited interim
	if (debugInterimsPane) {
		alert('view.js :: createInterimEditPane() :: init');
	}
	contentDiv = document.getElementById('content');
	editform = document.createElement('form');
	nametextdiv = document.createElement('div');
	nametextdiv.className = 'nametext';
	prefixtext = document.createTextNode('Interim Report for');
	nametext = document.createTextNode(studentInfo.name);
	nametextdiv.appendChild(prefixtext);
	nametextdiv.appendChild(document.createElement('br'));
	nametextdiv.appendChild(nametext);	
	nametextdiv.id = studentInfo.id;
	editform.appendChild(nametextdiv);

	// create the Category fieldset and buttons
	categoryFieldSet = document.createElement('fieldset');
	categoryLegend = document.createElement('legend');
	categoryLegend.appendChild(document.createTextNode('Progress Category'));
	categoryFieldSet.appendChild(categoryLegend);

	// create the outstanding button
	categoryFieldSet.appendChild(makeRadio('Outstanding', 'category', 'out', 1));

	// create the satisfactory button
	categoryFieldSet.appendChild(makeRadio('Satisfactory', 'category', 'sat', 2));

	// create the unsatisfactory button
	categoryFieldSet.appendChild(makeRadio('Unsatisfactory', 'category', 'unsat', 3));

	// create the failing button
	categoryFieldSet.appendChild(makeRadio('Failing', 'category', 'fail', 4));
	
	// create the comments box
	commentsFieldSet = document.createElement('fieldset');
	commentsFieldSetLegend = document.createElement('legend');
	commentsFieldSetLegend.appendChild(document.createTextNode('Comments'));
	commentsFieldSet.appendChild(commentsFieldSetLegend);
	comments = document.createElement('textarea');
	comments.id = 'comments';
	comments.cols = 60;
	comments.rows = 3;
	commentsFieldSet.appendChild(comments);
	
	// create the codesbox
	codesdiv = document.createElement('div');
	codesFieldSet = document.createElement('fieldset');
	codesLegend = document.createElement('legend');
	codesLegend.appendChild(document.createTextNode('Comment Codes'));
	codesFieldSet.appendChild(codesLegend);
	codesdiv.appendChild(codesFieldSet);

	// getcodes
	
	setCodes(codesFieldSet);
	
	// connect the elements
	editform.appendChild(categoryFieldSet);
	editform.appendChild(commentsFieldSet);
	editform.appendChild(codesdiv);
	contentDiv.appendChild(editform);
}

/*
	Returns a label with a button
*/
function makeRadio(labelText, name, id, value) 
{
	thelabel = document.createElement('label');
	thelabel.setAttribute('for', id);
	thelabel.className = 'buttonlabel';
	thebutton = document.createElement('input');
	thebutton.type = 'radio';
	thebutton.name = name;
	thebutton.id = id;
	thebutton.value = value;
	thelabel.appendChild(thebutton);
	thelabel.appendChild(document.createTextNode(labelText));	

	return thelabel;
}

function setCodes(target) 
{
	colnum = 1;
	codestable = document.createElement('table');
	codestable.className = 'codestable';
	row = document.createElement('tr');
	for (var order in codesArray) {
		code = codesArray[order];
		if (debugInterimsPane) {
			alert('view.js :: setCodes() --> create button for:  (' + order + ') ' + code.text);
		}
		col = document.createElement('td');
		//col.appendChild(makeRadioToggle(code.text, code.id));
		col.appendChild(makeRadioToggleNoFieldset(code.text, code.id));
		if (colnum == 1) {
			row.appendChild(col);
			colnum++;
		} else if (colnum == 2) {
			row.appendChild(col);
			colnum++;
		} else if (colnum == 3) {
			row.appendChild(col);
			row = document.createElement('tr');
			colnum = 1;
		} else {
			alert('error in setCodes');
		}
		codestable.appendChild(row);
	}
	target.appendChild(codestable);
}

function makeRadioToggle(label, theid) 
{
	
	thefieldset = document.createElement('fieldset');
	thefieldset.className = 'codesfieldset';
	thelegend = document.createElement('legend');
	thelegendtext = document.createElement('span');
	thelegendtext.className = 'buttonlabel';
	thelegendtext.appendChild(document.createTextNode(label));
	thelegend.appendChild(thelegendtext);
	thefieldset.appendChild(thelegend);
	thePlusButton = document.createElement('input');
	thePlusButton.onclick = function() { validateCheckboxPairs(theid); }
	thePlusButton.type = 'checkbox';
	thePlusButton.name = theid;
	thePlusButton.id = theid + 'plus';
	thePlusButtonLabel = document.createElement('label');
	thePlusButtonLabel.setAttribute('for', thePlusButton.id);
	theMinusButton = document.createElement('input');
	theMinusButton.onclick = function() { validateCheckboxPairs(theid); }
	theMinusButton.type = 'checkbox';
	theMinusButton.name = theid;
	theMinusButton.id = theid + 'minus';	
	theMinusButtonLabel = document.createElement('label');
	theMinusButtonLabel.setAttribute('for', theMinusButton.id);
	theMinusButtonLabel.appendChild(document.createTextNode('-'));
	theMinusButtonLabel.appendChild(theMinusButton);
	thefieldset.appendChild(thePlusButtonLabel);
	if (theid >= 90) {
		thePlusButtonLabel.appendChild(document.createTextNode('Yes'));		
		thePlusButtonLabel.appendChild(thePlusButton);
	} else {
		thePlusButtonLabel.appendChild(document.createTextNode('+'));
		thePlusButtonLabel.appendChild(thePlusButton);
		thefieldset.appendChild(theMinusButtonLabel);
	}
	return thefieldset;
}

function makeRadioToggleNoFieldset(label, theid) {
	container = document.createElement('div');
	thelegendtext = document.createElement('span');
	thelegendtext.className = 'buttonlabel';
	thelegendtext.appendChild(document.createTextNode(label));
	container.appendChild(thelegendtext);
	container.appendChild(document.createElement('br'));
	thePlusButton = document.createElement('input');
	thePlusButton.onclick = function() { validateCheckboxPairs(theid); }
	thePlusButton.type = 'checkbox';
	thePlusButton.name = theid;
	thePlusButton.id = theid + 'plus';
	thePlusButtonLabel = document.createElement('label');
	thePlusButtonLabel.setAttribute('for', thePlusButton.id);
	theMinusButton = document.createElement('input');
	theMinusButton.onclick = function() { validateCheckboxPairs(theid); }
	theMinusButton.type = 'checkbox';
	theMinusButton.name = theid;
	theMinusButton.id = theid + 'minus';	
	theMinusButtonLabel = document.createElement('label');
	theMinusButtonLabel.setAttribute('for', theMinusButton.id);
	theMinusButtonLabel.appendChild(document.createTextNode('-'));
	theMinusButtonLabel.appendChild(theMinusButton);
	container.appendChild(thePlusButtonLabel);
	if (theid >= 90) {
		thePlusButtonLabel.appendChild(document.createTextNode('Yes'));		
		thePlusButtonLabel.appendChild(thePlusButton);
	} else {
		thePlusButtonLabel.appendChild(document.createTextNode('+'));
		thePlusButtonLabel.appendChild(thePlusButton);
		container.appendChild(theMinusButtonLabel);
	}
	return container;
}