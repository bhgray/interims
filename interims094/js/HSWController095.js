// validateLogin method: validates a login request
function validateLogin()
{

	// get form form elements 'username' and 'password'
	// TAG:  PROTOTYPE
	var username = document.getElementById("username").value;
	var password = document.getElementById("password").value;


	/* TODO:  	need to implement security features --> dojo.crypto.MD5 is available
				for now, hash == password
	*/		
	// var hash = hex_md5(hex_md5(password) + seed);
	if (debugLogin) {
		alert("controller.js:  validateLogin() called:  " + username + "/" + password);
	}	

	var url = QUERY;
/*
	hack to avoid having to code in the MD5 hashing just yet -- want to use the dojo.crypto
	methods.
	
		var pars = 'task=getlogin&username=' + username + '&id=' + seed_id + '&hash=' + password;
*/
	var pars = 'task=getloginInsecure&username=' + username + '&password=' + password;
	dojo.io.bind( {
		url:  QUERY + "?" + pars,
		load:  function(type, data, evt) { loginSuccessJSON(type, data, evt); },
		error: function(type, error) { loginFailure(type, error); },	
		mimetype:  "text/json"
	});
} // end validateLogin()

function loginSuccessJSON(type, data, evt) {
	// the data argument IS the user object...
	user.name = data.name;
	user.teacherID = data.teacherID;
	user.privileges = data.privileges;
	user.lastLogin = data.lastLogin;
	user.userMessage = data.userMessage;
	user.completedInterims = data.completedInterims;
	user.totalInterims = data.totalInterims;
	user.courses = data.courses;
	if (debugLogin) { alert ('user received:  ' + user.name); }
	
	// show the main body now for the user.
	setupLoginInfo();
}

function loginSuccess(type, data, evt) 
{
	if (debugLogin) {
		alert('loginCallback success!');
	}

 	if (evt.responseXML) {
		xmldoc = evt.responseXML;
	}

	hasSeed = false;
	loggedIn = true;
	// args:  name, value, expires
	dojo.io.cookie.setCookie("name", xmldoc.getElementsByTagName('name').item(0).firstChild.data, -1);
	dojo.io.cookie.setCookie("teacherid", xmldoc.getElementsByTagName('schoolDistrictID').item(0).firstChild.data, -1);
	dojo.io.cookie.setCookie("privileges", xmldoc.getElementsByTagName('authlevel').item(0).firstChild.data, -1);
	dojo.io.cookie.setCookie("lastlogin", xmldoc.getElementsByTagName('lastlogin').item(0).firstChild.data, -1);
	dojo.io.cookie.setCookie("userMessage", xmldoc.getElementsByTagName('message').item(0).firstChild.data, -1);
	dojo.io.cookie.setCookie("completedInterims", xmldoc.getElementsByTagName('completed').item(0).firstChild.data, -1);

	// load the page now; note that this breaks the safari back and history stacks...
	window.location = "interims_0.95.html";
}

function loginFailure(type, error) 
{
	if (debugLogin) {
		alert('seedCallback failure with error message: ' + type.statusText);
	}
}

function getDefaults() {
	var url = QUERY;

	var pars = 'task=getdefaults';
	dojo.io.bind( {
		url:  QUERY + "?" + pars,
		load:  function(type, data, evt) {  defaultsSuccess(type, data, evt); },
		error: function(type, error) { defaultsFailure(type, error); },
		mimetype:  "text/xml"
	} );
 }

function defaultsSuccess(type, data, evt) {
	defaults = new Array();
	var rows = evt.responseXML.getElementsByTagName('default');
	if (debugDefaults) { alert('controller.js:  defaultsSuccess() returned OK with ' + rows.length + ' rows.');}
	for (i = 0; i < rows.length; i++) {
		row = rows[i];
		key = row.getElementsByTagName('key').item(0).firstChild.data;
		value = row.getElementsByTagName('value').item(0).firstChild.data;
		if (debugDefaults) { alert('defaultsSuccess() adding defaults[' + key + '] = ' + value); }
		defaults[key] = value;
	}
	setupLoginInfo();
}

function defaultsFailure(type, error) {
	
	alert('huh?  what happened to the defaults?');

}

function init() {

/*
		TODO:  have all initialization calls here.  Right now we chain through
				validateLogin -> loginSucess -> getDefaults -> defaultsSuccess -> setupLoginInfo -> createMenus
*/
// 	dojo.event.kwConnect(
// 		{
// 			srcObject:		this,
// 			srcFunction:	"defaultsSuccess",
// 			targetObject:	this,
// 			targetFunction:	"setupLoginInfo"
// 		}
// 	);
// 	dojo.event.topic.registerPublisher("/login", this, "defaultsSuccess");
// 	dojo.event.topic.subscribe("/login", this, "setupLoginInfo");

	// sequence:  page should load; id:main should fade; login panel should appear
	loadLogin();
	getDefaults();
}

function loadLogin() {
	var loginForm = dojo.widget.byId("loginForm");
	var btn = document.getElementById("hider0");
	loginForm.setCloseControl(btn);
	loginForm.show();
}

function clearContent() {
	document.getElementById("left").innerHTML = "";
	document.getElementById("right").innerHTML = "";
}

// function nice_close() {
// 	dojo.io.cookie.delete("name");
// 	dojo.io.cookie.delete("teacherid");
// 	dojo.io.cookie.delete("privileges");
// 	dojo.io.cookie.delete("lastlogin");
// 	dojo.io.cookie.delete("userMessage");
// 	dojo.io.cookie.delete("completedInterims");
// }

/*
		MENU EVENT HANDLERS
*/

function iEditHandler() {
	clearContent();
	var leftBox = dojo.byId("left");	
// 	var widget = dojo.widget.createWidget("StudentSortableTable", {
//                		url: "file:///~bhgray/Sites/interims094/js/sample-students.json"
//            			}, leftBox);
	var widget = dojo.widget.createWidget("StudentSortableTable", {
               		url: dojo.uri.dojoUri("http://bhgray-macbook.local/~bhgray/interims094/js/sample-students.json")
           			}, leftBox);
       
// 	var tableDiv = document.createElement("table");
// 	leftBox.appendChild(tableDiv);
// 	var tbody = document.createElement("tbody");
// 	tableDiv.appendChild(tbody);
// 	
// 	tableDiv.setAttribute("dojoType", "SortableTable");
// 	tableDiv.setAttribute("widgetId", "studentsTable");
// 	tableDiv.setAttribute("headClass", "fixedHeader");
// 	tableDiv.setAttribute("tBodyClass", "scrollContent");
// 	tableDiv.setAttribute("enableMultipleSelect", "false");
// 	tableDiv.setAttribute("enableAlternateRows", "true");
// 	tableDiv.setAttribute("rowAlternateClass", "alternateRow");
// 	tableDiv.setAttribute("cellPadding", 0);
// 	tableDiv.setAttribute("cellSpacing", 0);
// 	tableDiv.setAttribute("border", 0);
// 	
// 	var testRow = document.createElement("tr");
// 	var col1 = document.createElement("td").appendChild(document.createTextNode("12345678"));
// 	var col2 = document.createElement("td").appendChild(document.createTextNode("Gray, Brent"));
// 	testRow.appendChild(col1);
// 	testRow.appendChild(col2);
// 	tbody.appendChild(testRow);
}

function iViewHandler() {
	alert('Interims --> View');
}

function aPassHandler() {
	alert('Account --> Password');
}

function aDefHandler() {
	alert('Account --> Defaults');
}

function adSearchHandler() {
	alert('Admin --> Search');
}

function adDefaultsHandler() {
	alert('Admin --> Defaults');
}

function adUserMgmtHandler() {
	alert('Admin --> User Management');
}

function hInterimsHandler() {
	alert('Help --> Interims');
}

function hAccountHandler() {
	alert('Help --> Account');
}

function hPoliciesHandler() {
	alert('Help --> Policies');
}

function hAdminHandler() {
	alert('Help --> Admin');
}




     
 