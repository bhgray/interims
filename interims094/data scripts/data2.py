#!/usr/local/bin/python

import re

def surround(x):
	return '\'' + x + '\''

def findMods(x, advisory):
	num = int(x)
	if advisory:
		return '(Book ' +  str(num/10) + '0' + str(num%10) + ')'
	else:
		basemod = num % 20
		return '(Mods ' + str(basemod) + '/' + str(basemod + 1) + ')'

# here are the course codes!  Ugh!
course_codes = {
				'1':'Lunch (no grade)',
				'0100':'Eng 1',
				'0200':'Eng 2',
				'0300':'Eng 3',
				'0307':'Eng 3 *',
				'0400':'Eng 4',
				'0565':'Poetry (.5)',
				'0805':'Eng 4 AP',
				'1000':'World Hist',
				'1100':'Am Hist',
				'1200':'Soc Science',
				'1300':'Afr-Amer History',
				'1380':'Cont Issues (sem)',
				'1560':'Psychology (sem)',
				'1820':'US Hist AP',
				'2000':'Algebra 1',
				'2005':'Algebra 1 (HONORS)',
				'2150':'Geometry',
				'2157':'Geom (HONORS)',
				'2250':'Alg 2',
				'2252':'Alg 2(HONORS)',
				'2400':'Elem Func Sr.',
				'2402':'El func (Honors)',
				'2425':'Calculus (HONORS)',
				'2800':'Calc AP',
				'3000':'Biology',
				'3100':'Chem',
				'3200':'Physics',
				'3205':'Physics M',
				'3300':'Phy Science',
				'3480':'Intro to Engineering',
				'3490':'Env Science',
				'3809':'Chem AP',
				'4000':'French 1',
				'4020':'French 2',
				'4100':'Span 1',
				'4140':'Span 3',
				'4620':'Latin 2',
				'4850':'CSci AP',
				'6780':'DTP',
				'6784':'DTP 2',
				'6961':'CApp 9 (2p)',
				'6965':'CApp 11 (4/2)',
				'6967':'Adv Appl (.5)',
				'6984':'C++ 9 (4p)',
				'6985':'CS2 Java (4p)',
				'6987':'CS2 Java (4p)',
				'6988':'Adv JAVA (4p)',
				'6990':'Web Design (.5)',
				'7000':'HE1',
				'7100':'HE2',
				'7200':'PE1 (2p)',
				'7300':'PE2 (1p)',
				'7400':'PE3 (1p)',
				'7450':'PE3 (2p)',
				'7500':'PE4 (sem)',
				'7550':'PE4 (2p)',
				'8000':'Art (4/2)',
				'8040':'Art (G12)',
				'8260':'Instrumental Music',
				'9051':'Internship',
				'9060':'Internship',
				'9098':'Internship',
				'9099':'Senior residency (pass/fail)',
				'9400':'Serv Learning (M/N/?)',
				'9624':'Advisory'
}
# bugs:
#	trouble with no grades still ... see edward harley for cicc's class

debug = 1
teachers = dict()
students = dict()
rosters = dict()
courses = dict()
courseid = ''
f = open('/Volumes/Potemkin/Users/bhgray/Development/working/interims/datanew1', 'r')
lines = f.readlines()
f.close()
for line in lines:
	# line is:  school last first init course mods
	if line.startswith('403'):
		newTeacherLine = line.split(' ')
		#				0	1	2		3	4		5
		# insert into sql is:  init, last, first, login
		sdid = newTeacherLine[3]
		if not (teachers.has_key(sdid)):
			last = newTeacherLine[1].rstrip('[,]')
			first = newTeacherLine[2]
			login = newTeacherLine[1].rstrip('[,]') + newTeacherLine[2]
			if debug:
				print "teacher:" + last + ", " + first + "("  + login + ")"
			teachers[newTeacherLine[3]] = [newTeacherLine[3], newTeacherLine[1].rstrip('[,]'), newTeacherLine[2], newTeacherLine[1].rstrip('[,]') + newTeacherLine[2]]
		else:
			if debug:
				print 'duplicate teacher:' + last + ", " + first + "("  + login + ")"
		# courses:  courseid teacherid title
		courseid = newTeacherLine[4]+':'+newTeacherLine[5].rstrip('[\n]')
		if not (courses.has_key(courseid)):
			if debug:
				print "course:" + courseid + " " + newTeacherLine[3]
			courses[courseid] = [courseid, newTeacherLine[3]]
		else:
			if debug:
				print 'duplicate course:' + courseid + " " + newTeacherLine[3]
	else:
		# a student line:  last first grade citizenship id
		newstudentline = line.split(' ')
		sidregex = re.compile(r'[\d]{7}')
		studentid = sidregex.findall(line)[0]
		if not (students.has_key(studentid)):
			if debug:
				print "student:  (" + studentid + ") " + newstudentline[0] + " " + newstudentline[1]
			students[studentid] = [studentid, newstudentline[0], newstudentline[1]]
		else:
			if debug:
				print "duplicate student:  (" + studentid + ") " + newstudentline[0] + " " + newstudentline[1]
		# roster sql insert is:  studentid courseid (others...)
		if debug:
			print "roster:  (" +  courseid+studentid + ") " + courseid + " " + studentid
		if not (rosters.has_key(courseid+studentid)):
			rosters[courseid+studentid] = [courseid, studentid]
		else:
			if debug:
				print "duplicate roster:  (" +  courseid+studentid + ") " + courseid + " " + studentid

# now teachers, rosters and students are filled with data, ready to be output
#	use the table structure
f = open('/Volumes/Potemkin/Users/bhgray/Desktop/output.sql', 'w')

blank = '\' \''
# Teachers order:
#	autoincrement id
# 	school district id (initials)
#	last
# 	first
#	username
#	active
#	password
#	permissions
#	creation
#	last_login
#	last_modified

insertstring = 'INSERT INTO `int_teachers` (schoolDistrictID, lastName, firstName, username) VALUES'
for record in teachers.values():
	inits = record[0]
	last = record[1]
	first = record[2]
	login = record[3]
	password='password'
	active = '1'
	permissions='11111'
	# this is messed up --> not getting all the values in the right places...
	f.write(insertstring + '(' + surround(inits) + ',' + surround(last) + ',' + surround(first) + ',' + surround(login) + ');' + '\n')
f.flush()

# INSERT INTO `int_courses` VALUES ('6185', 'MBG', 'Algebra 2 7/8');
insertstring = 'INSERT INTO `int_courses` (courseID, teacherID, title) VALUES'
for record in courses.values():
	code = record[0][0:4]
	modNumber = record[0][5:]
	if code == '9624':
		modString = findMods(modNumber, 1)
	else:
		modString = findMods(modNumber, 0)
	if course_codes.has_key(code):
		title = course_codes[code] + modString
	else:
		title = 'Course code ' + code +  modString
	if debug:
		print record[0] + ' ' + code + ' ' + title
	f.write(insertstring + '(' + surround(record[0]) + ', ' + surround(record[1]) + ',' + surround(title) +');' + '\n')
f.flush()

# INSERT INTO `int_students` VALUES ('1111111', 'Hudson', 'Joseph', '203');
insertstring = 'INSERT INTO `int_students` (studentID, lastName, firstName) VALUES'
for record in students.values():
	f.write(insertstring + '(' + surround(record[0]) + ',' + surround(record[1]) +  ',' + surround(record[2]) + ');' + '\n')
f.flush()

# INSERT INTO `int_rosters` VALUES ('1111111', '6185', 'Joe is Satisfactory', '', '', '', 'false', '20051212070725', '');
insertstring = 'INSERT INTO `int_rosters` (studentID, courseID) VALUES'
for record in rosters.values():
	f.write(insertstring + '(' + surround(record[1]) + ',' + surround(record[0]) + ');' + '\n')
f.flush()
f.close()