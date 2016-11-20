#!/usr/local/bin/python

import re

def main(argv):
	# f = open('data1.txt', 'r')
# 	fin = f.read()
# 	# page header:   ALL MARKS REPORT BY TEACHER - All Grades 
# 	h1 = re.compile('[ *]ALL MARKS[ \t\w-]*')
# 	fin = h1.sub('', fin)
# 	# col header part1:   School Number  Teacher Name  Teacher Init  Subj  Sect  Id  Student Name  Alpha Grade  Num Grade  Citizenship 
# 	h2 = re.compile('[ *]School Number[ \t\w]*')
# 	fin = h2.sub('', fin)
# 
# 	# col header part2:  Subject Abs 
# 	h3 = re.compile('[ *]Subject[ \t\w]*')
# 	fin = h3.sub('', fin)
# 	
# 	# page footer page number:  Page 
# 	h4 = re.compile('Page #[ \t\w\d#]*')
# 	fin = h4.sub('', fin)
# 
# 	# page footer time/date stamp 
# 	h5 = re.compile('(Mon|Tue|Wed|Thu|Fri|Sat|Sun)[ \t\w\d:]*')
# 	fin = h5.sub('', fin)
# 	
# 	# take out repetitive linefeeds
# 	h6 = re.compile('\n\n')
# 	fin = h6.sub('', fin)
# 	
# 	
# 	# find the \n<bad# OR question mark><7 digit id> sequence and take out the \n<bad digit> fields
# 	# is this messing up?  check...
# 	h7 = re.compile('(.){1}(\d{7})')
# 	fin = h7.sub(r'\2', fin)
# 	
# 	h7a = re.compile('\n(\d{7})')
# 	fin = h7a.sub(r'\1', fin)
# 	
# 	# for some reason, some have question marks in front of the id
# 	h7b = re.compile('\?')
# 	fin = h7b.sub('', fin)
# 	
# 	# get rid of spaces in front of all the returns
# 	h8 = re.compile('(.*?)( \n)')
# 	fin = h8.sub(r'\1\n', fin)
# 	
# 	#some lines have two students
# 	h9 = re.compile('(.*?)(\d{7})[ ]([ \w]*?)(\d{7})')
# 	fin = h9.sub(r'\1\2\n\3\4', fin)
	#works to here...
	
	# the above fails in three situations:
	# <teacher record> <student record>  b/c no 7 digit ID in middle as dividing line
	# <student record> <teacher record> b/c no 7 digit ID at end of line
	# <student record> <student record with hyphen in name!> why???
	# I hand-corrected this time (approx 30 lines?)


	# then I re-opened the hand-corrected file to continue....
	# must (1) add teacher record fields to front of each student record; and then
	# (2) split into table inserts.... and (3) create SQL.... UGH
	
	# for some reason, some lines have two students... break them after the first ID number...
# 	h8 = re.compile('(.*?)(\d{7})(\w*)')
# 	h8 = re.compile('(.*?)(\d{7})\b(.*)\b(\d{7})')
# 
# 
# 	fin1 = h.sub(r'\1\2\n\3', fin)

# after hand tuning -- reread lines
	
	teachers = []
	students = []
	rosters = []
	courses = []
	courseid = ''
	f = open('datanew1', 'r')
	lines = f.readlines()
	f.close()
	for line in lines:
		if line.startswith('403'):
			newTeacherLine = line.split(' ')
			# line is:  school last first init course mods
			#				0	1	2		3	4		5
			# insert into sql is:  init, last, first, login
			teachers.append([newTeacherLine[3], newTeacherLine[1].rstrip('[,]'), newTeacherLine[2], newTeacherLine[1].rstrip('[,]') + newTeacherLine[2]])
			# courses:  courseid teacherid title
			courseid = newTeacherLine[4]+':'+newTeacherLine[5]
			courses.append([courseid, newTeacherLine[3], ""])
		else:
			# a student line:  last first grade citizenship id
			#					0	1		2		3		4
			# insert into sql is:  id last first advisory
			newstudentline = line.split(' ')
			studentid = newstudentline[4]
			students.append([studentid, newstudentline[0], newstudentline[1]])
			# roster sql insert is:  studentid courseid (others...)
			rosters.append([courseid, studentid])
	
	# now teachers, rosters and students are filled with data, ready to be output
	f = open('output', 'w')
	insertstring = 'INSERT INTO; `int_teachers` VALUES'
	for teacher in teachers:
		f.write(insertstring + '(\'\',\'' + teacher[0] + '\', \'' + teacher[1] +  '\', \'' + teacher[2] +  '\', \'' + teacher[3] + '\');' + '\n')
	f.flush()
	insertstring = 'INSERT INTO; `int_students` VALUES'
	for student in students:
		f.write(insertstring + '(\'\',\'' + student[0] + '\', \'' + student[1] +  '\', \'' + student[2] +  '\');' + '\n')
	f.flush()
	insertstring = 'INSERT INTO; `int_rosters` VALUES'
	for roster in rosters:
		f.write(insertstring + '(\'\',\'' + roster[0] + '\', \'' + roster[1] +  '\');' + '\n')
	f.flush()
	f.close()