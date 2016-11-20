// debug
var debugLoginView = false;
var debugLogin = false;
var debugDefaults = false;
var debugMenuView = false;
var debugClassesMenu = false;
var debugStudentNames = false;
var debugStudentNames1 = false;
var debugEditInterims = false;
var debugInterimsPane = false;

var QUERY = 'scripts/queryresponder.php';
// current connection object
var cObj;

// status items
var hasSeed = false;
var loggedIn = false;
var seed_id = 0;
var seed = 0;
var systemopens = Date();

// current user
var user = 
{
	name: '',
	teacherID: '',
	privileges: '00000',
	lastLogin: '',
	userMessage: '',
	completedInterims: 0,
	totalInterims: 0,
	courses: ''
}

function Code(id, text) 
{
	this.id = id;
	this.text = text;
}

// studentsArray should contain Student objects
var studentsArray = new Array();
function Student(id, name, mod)
{
	this.idNumber = id;
	this.theName = name;
	this.intStatus = mod;
	this.out = '';
	this.sat = '';
	this.unsat = '';
	this.fail = '';
	this.comments = '';
	this.codes = '';
	
	this.setOut = function(value) {
		this.out = value;
	}
	this.setSat = function(value) {
		this.sat = value;
	}
	this.setUnsat = function(value) {
		this.unsat = value;
	}
	this.setFail = function(value) {
		this.fail = value;
	}
	this.setComments = function(value) {
		this.comments = value;
	}	
	this.setCodes = function(value) {
		this.codes = value;
	}
}

var codesArray = new Array();
var defaults = new Array();

var OPENS_KEY = 'system_opens';
var MESSAGES_KEY = 'message';
var SCHOOL_KEY = 'school_name';
var SCHOOL_ABBREV_KEY = 'school_abbreviation';
var SYSTEM_VERSION_KEY = 'version_number';
var SYSTEM_NAME_KEY = 'system_name';

// user permissions
var VIEW_PERMISSION = 1;
var EDIT_PERMISSION = 2;
var SINGLE_ACCOUNT_ADMIN = 4;
var EDIT_USERS_ADMIN = 8;
var SUPERUSER = 32;
