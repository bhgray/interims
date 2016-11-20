function clearMessages() {
	$('systemmessage').innerHTML = "";
	$('usermessage').innerHTML = "";
}	

function clearContent() 
{
	var leftbox = $('sidebar');
	leftbox.visibility = 'hidden';
	leftbox.innerHTML = "";

	var rightbox = $('content');
	rightbox.visibility = 'hidden';
	rightbox.innerHTML = "";
}

function clearContentPanel() 
{
	document.getElementById('content').innerHTML = "";
}

function clearMenus() {
	$('menu').innerHTML = "";
}

function clearFunctions() {
	$('functions').innerHTML = "";
}

function setUpLoginPanel()
{
	var loginPanel = $('login');
	loginPanel.innerHTML = "";
	if (debugLoginView) {alert('getElementById:  ' + loginPanel);}

	var loginform = Builder.node('form', {id:'loginform', action:'javascript:validateLogin()'});
	var messagediv = Builder.node('div', {id:'message', className:'generaltext'}, 'Enter your username and password.');
	var usernameinputlabel = Builder.node('label', {'for':'username', className:'generaltext'}, 'Username:  ');	
	var usernameinput = Builder.node('input', {id:'username', type:'text', name:'username', tabindex:'1', size:'12'});	
	var passwordinputlabel = Builder.node('label', {'for':'password', className:'generaltext'}, 'Password:  ');	
	var passwordinput = Builder.node('input', {type:'password', name:'password', tabindex:'2',id:'password', size:'10'});
	
	// create the submit button
	var submit = Builder.node('input', {type:'button', tabindex:'3', value:'Login', onclick:'validateLogin()'});

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
		
		var loginPanel = $('login');
		// create a paragraph element
		var logoutbutton = Builder.node('a', {href:'javascript:logout()'}, 'logout');
		var p = Builder.node('div', {className:'generaltext'}, ['Logged in as:  ', Builder.node('strong', user.name), '[', logoutbutton, ']']);
		
		loginPanel.appendChild(p);

		var loginform = $('loginform');
		loginPanel.removeChild(loginform);
		// if there is a message to users, now you can display it
		setupSystemMessages();
		// if there is a personal message to the logged in user, display that
		setupUserMessages();
		setupMainMenu();
	}
}

function setupUserMessages() {
		// set up the message, if any
		var login = new Date();
		login.setTime(user.lastLogin*1000);
		var intro = Builder.node('div', {className:'message'}, ['Last Login:  ', login.toLocaleString(), Builder.node('br'), 'User Message:  ',user.userMessage]);
		$('usermessage').appendChild(intro);
}

function setupSystemMessages()
{
	// put system information and any systemwide messages out
	var m = new String(findDefaultWithKey(MESSAGES_KEY));
	if (m == "undefined") { m = "Welcome to the Interims System."; }
	var mess = Builder.node('div', {className: 'message'}, ['System Message:  ', m.toString()]);
	$('systemmessage').appendChild(mess);
}

function setupMainMenu() {

	if (debugMenuView) { alert('(privileges & VIEW_PERMISSION) == (' + user.privileges + ' & ' + VIEW_PERMISSION + ') == ' + (user.privileges & VIEW_PERMISSION)); }
	if ((user.privileges & VIEW_PERMISSION) == VIEW_PERMISSION) {
		$('menu').appendChild(Builder.node('a', {href:'javascript:showInterimsFunctions()'}, '[Interims System]'));
		
	}
	
	if (debugMenuView) { alert('(privileges & SINGLE_ACCOUNT_ADMIN) == (' + user.privileges + ' & ' + SINGLE_ACCOUNT_ADMIN + ') == ' + (user.privileges & SINGLE_ACCOUNT_ADMIN)); }
	if ((user.privileges & SINGLE_ACCOUNT_ADMIN) == SINGLE_ACCOUNT_ADMIN) {
		$('menu').appendChild(Builder.node('a', {href:'javascript:showAccountFunctions()'}, '[Account]'));
	}

	if (debugMenuView) { alert('(privileges & SUPERUSER) == (' + user.privileges + ' & ' + SUPERUSER + ') == ' + (user.privileges & SUPERUSER)); }
	if ((user.privileges & SUPERUSER) == SUPERUSER) {
		$('menu').appendChild(Builder.node('a', {href:'javascript:showAdminFunctions()'}, '[Admin]'));
	}
}

function showAccountFunctions() {

	clearFunctions();	
	clearContent();
	
	$('functions').appendChild(Builder.node('a', {href:'javascript:editPassword()'}, '[Change Password]'));
}

function showInterimsFunctions() {

	clearFunctions();
	clearContent();

	$('functions').appendChild(Builder.node('a', {href:'javascript:editClassesMenu()'}, '[Edit]'));
}

function editClassesMenu() {
	getCodes();
	getClasses();
}

function createClassesMenu() {

	// if the menu already exists, get rid of it and start fresh
	if ($('classes')) {
		$('functions').removeChild($('classes'));
	}
	
	if (debugClassesMenu) { 
		alert("createClassesMenu():  coursesArray (" + user.courses.length + ") --> " + user.courses.toString());
		alert("createClassesMenu():  menuPanel --> " + menuPanel);
	};
	
	var classes = Builder.node('select', {id:'classes', onchange:'editClassInterims()', width:'20'});
	var newOption = Builder.node('option', {value:'none', selected:'selected'},'<--- Select A Course --->');
	try {
		classes.add(newOption, null); // standards compliant; doesn't work in IE
	}
	catch(ex) {
		classes.add(newOption); // IE only
	}

	// turns the courses associative array into a hash (using Prototype)
	var c = $H(user.courses);
	
	c.each(function (course) {
		classes.add(Builder.node('option', {value: course.key}, course.value), null);
	});
	
	$('functions').appendChild(classes);
}

function createNamesMenu() 
{
	if (debugStudentNames1 && studentsArray.length > 0) {alert('view.js :: createNamesMenu() :: invocation')}
	var namesTable = Builder.node('table', {className:'namestable', id:'ntable', summary:'Student Names'});
	var nBody = Builder.node('tbody');
	// problem is here....

	for (var n = 0; n < studentsArray.length; n++) {
		var newRow = Builder.node('tr', {className:'unedited'});
		var student = studentsArray[n];
		var cellText = Builder.node(student.theName,Builder.node('br'), '(ID:  ', student.idNumber, ')');
		if (debugStudentNames1) {alert('view.js :: createNamesMenu :: new cell with text --> ' + cellText)}
		var newCell = Builder.node('td', {id: student.idNumber}, cellText);
		newRow.appendChild(newCell);
		// set the onclick property to call the function
		newRow.setAttribute('onclick', "getStudentInterim(" + student.idNumber + ", '" + $F('classes') + "')");
		nBody.appendChild(newRow);
	}

/*	studentsArray.each( function(student) {
		var newRow = Builder.node('tr');
		if( student.modified > findDefaultWithKey(OPENS_KEY)) {
			newRow.className = 'modified';
		} else {
			newRow.className = 'unedited';
		}
		var cellText = student.theName + '<br />' +'(ID:  ' + student.key + ')';
		if (debugStudentNames1) {alert('view.js :: createNamesMenu :: new cell with text --> ' + cellText)}
		var newCell = Builder.node('td', {id: student.key}, cellText);
		newRow.appendChild(newCell);
		// set the onclick property to call the function
		newRow.setAttribute('onclick', "getStudentInterim(" + student.key + ", '" + $F('classes') + "')");
		nBody.appendChild(newRow);
	});
*/	
	namesTable.appendChild(nBody);
	$('sidebar').appendChild(namesTable);	
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