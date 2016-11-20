function setupLoginInfo()
{
	// show the main content area
	dojo.byId("main").style.display = "inline";
	//alert('setupLoginInfo called');
	// build the header content based upon the defaults in the database
	loginHeader = dojo.widget.byId('loginInfo');
	systemHeader = dojo.widget.byId('systemInfo');

	// this is all initialized via AJAX/JSON now...	
// 	user.name = dojo.io.cookie.getCookie("name");
// 	user.privileges = dojo.io.cookie.getCookie("privileges");
// 	user.lastLogin =  dojo.io.cookie.getCookie("lastLogin");
// 	user.userMessage = dojo.io.cookie.getCookie("userMessage");
// 	user.completedInterims = dojo.io.cookie.getCookie("completedInterims");
	
	titleEl = document.createElement('p');
	titleEl.setAttribute("class", "title");
	titleEl.appendChild(document.createTextNode(defaults[SCHOOL_ABBREV_KEY] + " " + defaults[SYSTEM_NAME_KEY]));
	titleEl.appendChild(document.createElement("br"));
	titleEl.appendChild(document.createTextNode("Version:  " + defaults[SYSTEM_VERSION_KEY]));
	titleEl.appendChild(document.createElement("br"));
	titleEl.appendChild(document.createTextNode("System Message(s):  " + defaults[MESSAGES_KEY]));
	
	
	loginEl = document.createElement('p');
	loginEl.appendChild(document.createTextNode("Logged in as:  " + user.name));
	loginEl.appendChild(document.createElement("br"));
	loginEl.appendChild(document.createTextNode("Last Login:  " + user.lastLogin));
	loginEl.appendChild(document.createElement("br"));
	loginEl.appendChild(document.createTextNode("User Message:  " + user.userMessage));
	systemHeader.setContent(titleEl);
	loginHeader.setContent(loginEl);
	
	createMenus();
}

function createMenus() {

	var menubarAttachPoint = document.getElementById("menubar");
	var menubar = dojo.widget.createWidget("MenuBar2", {id: "mbar"}, menubarAttachPoint);
	
	var menu1 = dojo.widget.createWidget("PopupMenu2", {id: "interimsMenu"});
	menu1.addChild(dojo.widget.createWidget("MenuItem2", {caption: "Edit", onClick: iEditHandler}));
	menu1.addChild(dojo.widget.createWidget("MenuItem2", {caption: "View", onClick: iViewHandler}));

	var menu2 = dojo.widget.createWidget("PopupMenu2", {id: "accountMenu"});
	menu2.addChild(dojo.widget.createWidget("MenuItem2", {caption: "Change Password", onClick: aPassHandler}));
	menu2.addChild(dojo.widget.createWidget("MenuItem2", {caption: "Change Defaults", onClick: aDefHandler}));
	
	var menu3 = dojo.widget.createWidget("PopupMenu2", {id: "adminMenu"});
	menu3.addChild(dojo.widget.createWidget("MenuItem2", {caption: "Search Interims", onClick: adSearchHandler}));
	menu3.addChild(dojo.widget.createWidget("MenuItem2", {caption: "Change Defaults", onClick: adDefaultsHandler}));
	menu3.addChild(dojo.widget.createWidget("MenuItem2", {caption: "User Management", onClick: adUserMgmtHandler}));

	var menu4 = dojo.widget.createWidget("PopupMenu2", {id: "helpMenu"});
	menu4.addChild(dojo.widget.createWidget("MenuItem2", {caption: "Interims Help", onClick: hInterimsHandler}));
	menu4.addChild(dojo.widget.createWidget("MenuItem2", {caption: "Account Help", onClick: hAccountHandler}));
	menu4.addChild(dojo.widget.createWidget("MenuItem2", {caption: "Policies Help", onClick: hPoliciesHandler}));
	menu4.addChild(dojo.widget.createWidget("MenuItem2", {caption: "Admin Help", onClick: hAdminHandler}));

	menubar.addChild(dojo.widget.createWidget("MenuBarItem2", {caption: "Help", submenuId: "helpMenu"}));
	menubar.addChild(dojo.widget.createWidget("MenuBarItem2", {caption: "Admin", submenuId: "adminMenu"}));
	menubar.addChild(dojo.widget.createWidget("MenuBarItem2", {caption: "Account", submenuId: "accountMenu"}));
	menubar.addChild(dojo.widget.createWidget("MenuBarItem2", {caption: "Interims", submenuId: "interimsMenu"}));

}

