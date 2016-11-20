/*
		StudentSortableTable.js
		
		A widget for manipulating student records
*/
dojo.provide("hswwidgets.StudentSortableTable");
dojo.require("dojo.widget.*");
dojo.widget.tags.addParseTreeHandler("hswwidgets:studentsortableTable");


dojo.widget.defineWidget("hswwidgets.StudentSortableTable", dojo.widget.SortableTable,
	{
		templatePath:"http://127.0.0.1/~bhgray/interims094/js/widgets/StudentSortableTable/StudentSortableTable.html",
		templateCssPath:"http://127.0.0.1/~bhgray/interims094/js/widgets/StudentSortableTable/StudentSortableTable.css",
		
		/* Default Property Values */
		url: "!",
		
		/* Lifecycle hooks */
		
		postMixInProperties: function() {
			this.strings = {
				/*  any template necessary strings here */
			} // end this.strings
		}, // end postMixInProperties
		
		fillInTemplate: function() {
			var list = this.studentListings;
			
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
						list.appendChild(row);
					}	// end forEach				
				}, // end load
				error:		function() {
					var errorMessage = document.getElementById("error");
					errorMessage.innerHTML = dojo.string.escape("html", "No records available.  Please contact the administrator.");
				} // end error
			}); // end dojo.io.bind
		} // end fillInTemplate
	},
	"html",
	function() {
 		this._secretIdentity = dojo.dom.getUniqueId();
	}
	); // end defineWidget