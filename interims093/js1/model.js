// view variables

var showingLoggedIn = false;
var messageElement = false;
var messageP = false;

// debug
var debug = false;
var debugC1 = false;
var debugC2 = false;
var debugC3 = false;
var debugC4 = false;
var debugC5 = false;
var debuglogin = false;
var debugdefaults = false;
var debugWrite = false;
var debugajax = false;
var debugcodes = false;
var debugcodes1 = false;
var debugprint = false;
var debugWriteAll = false;
var debugerrorhandling = true;
var debugNewButtons = false;

var debugV1 = false;
var debugV2 = false;
var debugV3 = false;
var debugV4 = false;
var debugV5 = false;

// fields in currentStudentRecord
var ID = 0;
var FIRST_NAME = 1;
var LAST_NAME = 2;
var OUTSTANDING_ITEM = 3
var SATISFACTORY_ITEM = 4;
var UNSATISFACTORY_ITEM = 5;
var FAILING_ITEM = 6;
var COMMENTS_ITEM = 7;
var DANGER_ITEM = 8;
var MODIFIED = 9;
var MODIFIED_BY = 10;
var CODES = 11;

// fields in defaults array
var KEY = 0;
var VALUE = 1;
var OPENS_KEY = 'system_opens';
var MESSAGES_KEY = 'message';


// constants
var NORMAL_STATE = 4;
var LOGIN_PREFIX = 'scripts/queryresponder.php?';
var QUERY_PREFIX = 'scripts/queryresponder.php?';
var LOGIN = 'scripts/queryresponder.php';
var QUERY = 'scripts/queryresponder.php';

// user permissions
var VIEW_PERMISSION = 1;
var EDIT_PERMISSION = 2;
var SINGLE_ACCOUNT_ADMIN = 4;
var EDIT_USERS_ADMIN = 8;
var SUPERUSER = 32;

// array indices
var COURSEID = 0;
var COURSETITLE = 1;

var CODE = 0;
var TEXT = 1;
var ORDER = 2;

var UNEDITED_STATUS = 0;
var EDITED_STATUS = 1;
var MODIFIED_STATUS = 2;
var ACTIVE_STATUS = 3;

// error handling
// 1000 series:  application/db errors
var ERR_GETSEED = 1000;
var ERR_LOGIN = 1001;
var ERR_DEFAULTS = 1002;
var ERR_GETCLASSES = 1003;
var ERR_GETALLSTUDENTS = 1004;
var ERR_WRITERECORD = 1005;
var ERR_WRITE_RECORD_NUM_ROWS = 1006;
var ERR_GETCODES = 1007;

// variables
//var http = getHTTPObject(); // We create the HTTP Object
var http = new RemoteConnection();

var hasSeed = false;
var loggedIn = false;
var seed_id = 0;
var seed = 0;
var systemopens = Date();

var fullname = '';
var teacherid = '';
var lastlogin = '';
var privileges = '00000';
var messages = '';
var usermessage = '';
var completedinterims = 0;
var totalinterims = 0;

var defaultsArray;
var coursesArray;
var studentsArray;
var currentStudentRecord;
var currentStudentID;
var currentClassID;
var currentClassName;
var codesArray;
