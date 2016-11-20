// method that sets up a cross-browser XMLHttpRequest object

var debug = false;

function getHTTPObject() {

	var http_object;

	// Mozilla and others method

	if (!http_object && typeof XMLHttpRequest != 'undefined') {
		try {
			http_object = new XMLHttpRequest();
		}
		catch (e) {
			http_object = false;
		}
	}
	
	if (debug) {
		alert("getHTTPObject() returned" + http_object);
	}

	return http_object;
}