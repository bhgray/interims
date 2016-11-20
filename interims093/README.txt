2005-12-12-0003

create a new table in the db that has system-wide preferences, etc...
One pref will be the date the system opened for interims, and the date
it is closing.

When user choose a class, color of each student row should be GREEN if 
the entry has a modified date > opening date; and red otherwise.  Upon 
a successful writeRecord, the row turns green, but then red again if the 
user changes any row (onchange event).

-- must implement the modified field change to NOW() and the comparator --
means that we must get that field with the record sql query and use it 
to determine the color.

-- also include last login and status messages for the current user.

for entry:  have the top box have all the codes.  User clicks on codes when
focus is in a SAT/UNSAT/FAILING/COMMENTS box, and the code automatically fills in.  Also allow freeform comments.
Query:  have to fields for each (1) an uneditable text field that simply holds all the selected comments from the codes; and (2) the freeform box.  These would be combined in the read/write in a way that we can parse out and separate again on the read side.

Then on printing -- instead of having parents look up codes, we can actually print out the comments themselves.  So need to do two forms -- one like ours currently then a new prototype.

also, create a new table of the codes for reference

2005-12-12-2005

Notes on data

Classes have a teacher line followed by n student lines

Teacher line

	school code<space>last,<space>first initial<space>teacher initials<space>subject code<space>section code<space>
	
	example:
	
		403 AGLIRA, D EDA 0100 10 

Student Line

	last<space>first<space>grade<space>citizenship<space><return>
	idnumber<space><return>
	
at end of greps, we want the entire file to look like this:

schoolcode<tab>teacher_last<tab>first_inital<tab>teacher_initials<tab>subject<tab>section<tab>student_last<tab>student_first<tab>numeric<tab>citizenship<tab>id<return>

this will allow use of excel, etc... to grab the columns appropriately.

1.	grep out " ALL MARKS REPORT BY TEACHER - All Grades<return> School Number  Teacher Name  Teacher Init  Subj  Sect  Id  Student Name  Alpha Grade  Num Grade  Citizenship<return> Subject Abs" header
2.	grep out "Page # 1 <return>Thu Dec 01 12:10:09 EST 2005" footer
3.	grep out the returns separating each student name from their ID number on the following line:

	ex:  	HOLLAND DENEIR 082 1 
			03500906 
			
		becomes
			HOLLAND DENEIR 082 1 03500906
			
4.	grep out the extraneous first digit of the id number (perhaps with 3?)
5.	turn spaces to tabs
6.	add 7 tabs to front of each student line


2005-12-16-1850

for each line:
	if line begins with 403
		process teacher line, begin new class
	else
		process student line, appending to current class
		
		
2005-12-17-0804

	works now... but ahmed's class doesn't have grades, which messes up the positions of the 
	id numbers.... need to check for the length of each student line imported, and make decision
	about where the id number is based on that...
	
	we could use re module to find the id number pretty easily, that way we can skip everything in
	the line after the name info.  Thus, only access names by list indexing, then access id by 
	regex...
	
2005-12-29-0817

Need a major re-write of the httprequest system according to the devX article.  This requires concentration, so not today.

2005-12-30-1836

Codes show now.

-	codes are in left-right order; s/b top-bottom
-	squeeze more space out of top so that no top-bottom scrollbar

2006-01-01-1254

-	space squeezing
-	refactor for multiple httprequests....  currently, we are running into trouble with having to chain together all the requests so that they don't run into each other... need to have them function concurrently.

2006-01-17-1939

+	have refactored for multiple httprequests
+	printing in the works
-	formulate SQL query on the full printing option
-	generate new window with new DOM document containing the results of the query.
	queryresponder is now messed up....
	so is controller and view
	
2006-01-23-0907

NOTE:  student db always available via the osxserver start of year setup instructions (pdf copy in folder)
