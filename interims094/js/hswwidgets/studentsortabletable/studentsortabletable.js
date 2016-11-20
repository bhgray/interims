/*
		StudentSortableTable.js
		
		A widget for manipulating student records
*/
dojo.provide("dojo.StudentSortableTable");
dojo.require("dojo.widget.*");

dojo.StudentSortableTable = function() {

	// for inheritance
	dojo.widget.SortableTable.call(this);
	this.templatePath = dojo.uri.dojoUri("http://127.0.0.1/~bhgray/interims094/js/hswwidgets/StudentSortableTable/StudentSortableTable.html");
	this.templateCSSPath = dojo.uri.dojoUri("http://127.0.0.1/~bhgray/interims094/js/hswwidgets/StudentSortableTable/StudentSortableTable.css");
	
	// override defaults
	this.widgetType = "StudentSortableTable";
	
	// useful properties
	this.url = "";
	
	// DOM nodes
	this.studentsContainer = null;
	
	this.fillInTemplate = function() {
	
		var list = this.studentsContainer;
			
		dojo.io.bind({
			url: 		this.url,
			mimetype: 	"text/json",
			load:  		function(type, data, evt) {
				dojo.lang.forEach(data.students, function(student) {
					var row = document.createElement("tr");
					
					var c1 = document.createElement("td");
					c1.innerHTML = dojo.string.escape("html", student.id);
					var c2 = document.createElement("td");
					c2.innerHTML = dojo.string.escape("html", student.name);
					var c3 = document.createElement("td");
					c3.innerHTML = dojo.string.escape("html", student.modified);
					
					row.appendChild(c1);
					row.appendChild(c2);
					row.appendChild(c3);
					container.appendChild(row);
				}	// end forEach				
			}, // end load
			error:		function() {
				var errorMessage = document.getElementById("error");
				errorMessage.innerHTML = dojo.string.escape("html", "No records available.  Please contact the administrator.");
			} // end error
		}); // end dojo.io.bind
	} // end fillInTemplate
}

dj_inherits(dojo.widget.SortableTable, dojo.widget.HtmlWidget);
dojo.widget.tags.addParseTreeHandler("hswwidgets:studentsortableTable");