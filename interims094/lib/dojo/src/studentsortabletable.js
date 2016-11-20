/*
		StudentSortableTable.js
		
		A widget for manipulating student records
*/
dojo.provide("dojo.StudentSortableTable");
dojo.require("dojo.widget.*");
dojo.require("dojo.widget.html.SortableTable");

dojo.widget.tags.addParseTreeHandler("dojo:studentsortableT\table");


dojo.widget.defineWidget("dojo.StudentSortableTable", dojo.widget.html.SortableTable,
	{
		templatePath:		dojo.uri.dojoUri("http://127.0.0.1/~bhgray/interims094/lib/dojo/studentsortabletable/StudentSortableTable.html"),
		templateCssPath:	dojo.uri.dojoUri("http://127.0.0.1/~bhgray/interims094/lib/dojo/studentsortabletable/StudentSortableTable.css"),
		
		/* Default Property Values */
		url: "!",
		
		/* Lifecycle hooks */
				
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
					}// end anonymous function				
					) // end for-each
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