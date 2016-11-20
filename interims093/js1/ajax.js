// constants

// for status and state codes see:  http://www.w3.org/Protocols/rfc2616/rfc2616-sec10.html
var HTTP_STATUS_OK = 200;
var READYSTATE_COMPLETED = 4;

/*
	¥	ELEMENT_NODE = 1
	¥	ATTRIBUTE_NODE = 2
	¥	TEXT_NODE = 3
	¥	CDATA_SECTION_NODE = 4
	¥	ENTITY_REFERENCE_NODE = 5
	¥	ENTITY_NODE = 6
	¥	PROCESSING_INSTRUCTION_NODE = 7
	¥	COMMENT_NODE = 8
	¥	DOCUMENT_NODE = 9
	¥	DOCUMENT_TYPE_NODE = 10
	¥	DOCUMENT_FRAGMENT_NODE = 11
	¥	NOTATION_NODE = 12
*/

var NODE_TYPE_ELEMENT = 1;



/**
 * This is a quick class to get around JavaScript's
 * poor support for associative arrays. Specifically, 
 * without this class, properties of the object would
 * be included as keys in the associative array. This
 * class ensures that we deal only with array elements 
 * we added to the array and not any properties of the
 * container we're using. See Side Bar 1.
 */
function _RCHashtable()
{
   this.data = new Object();
   this.keys = new Array();
} // end constructor


function _RCHashtable_getKey(raw)
{
   // python style naming convention, 
   // to avoid conflicts with actual 
   // attributes (see Side Bar 1).
   return '__'+ raw +'__';
} // end function _RCHashtable_getKey


function _RCHashtable_get(nam)
{
   var key = this.getKey(nam);
   // retreive value if exists, else null
   var val = (this.data[key]) ? this.data[key] : null;
   return val;
} // end function _RCHashtable_get


function _RCHashtable_put(nam, val)
{
	if (debugajax) { alert('ajax.js:  _RCHashtable_put called on ' + nam + ': ' + val); }
   // if missing arg
   if (!nam) return false;
   
   var key = this.getKey(nam);
   
   // if key doesn't already exist add 
   // to keys array.
   var exists = true;
   if (!this.data[key])
   {
      exists = false;
      this.keys[this.keys.length] = key;
   }
   
   // return old value if set, or else null
   var oldval = exists ? this.data[key] : null;
   
   this.data[key] = val;
    
   return oldval;
} // end function _RCHashtable_put


function _RCHashtable_keys()
{
   // return a copy of the array, otherwise
   // the user of this class could accidentally
   // modify our array, since weâ€™d be passing
   // them a reference.
   return keys.slice(0);
} // end function _RCHashtable_keys


function _RCHashtable_containsKey(nam)
{
   // get() returns null if not found 
   // or if found and is null. In both
   // conditions, we want to return false.
   // Otherwise, we want to return true.
   return (this.get(nam) != null);
} // end function _RCHashtable_containsKey

// creating the class this way is more memory efficient
// if we are using multiple instances of this data 
// structure. Weâ are only using one, so thereâ is really 
// no memory gain. However, I generally use this method
// with data structures for consistency's sake.
_RCHashtable.prototype.getKey = _RCHashtable_getKey;
_RCHashtable.prototype.get = _RCHashtable_get;
_RCHashtable.prototype.put = _RCHashtable_put;
_RCHashtable.prototype.keys = _RCHashtable_keys;
_RCHashtable.prototype.containsKey = _RCHashtable_containsKey;





/**
 * This is the class that deals with remote requests.
 * This implementation uses XMLHttpRequest, but the 
 * idea is that you could swap implementations without 
 * changing any code that uses this class.
 */
function RemoteConnection(recurseOnChildren)
{
	if (debugajax) { alert('ajax.js:  RemoteConnection constructor'); }
   // array where weâwill store our request objects
   this.aRequests = new Array();
   this.aRequests[0] = null;
   // our container to map elements to handling 
   // functions
   this.hRespHandlers = new _RCHashtable();
   // flag to track whether a wildcard handler 
   // has been set.
   this.isWildcardSet = false;
   // whether or not to recurse on children of a 
   // matched subtree that has already been passed
   // to an appropriate handler function.
   // the code is such because it is an optional
   // parameter and might not be defined (but if
   // it is defined and is not false then we also know 
   // its value. So we just assign it literally.
   this.request = function(url, method, requestxml)
      {
         // set defaults omitted optional arguments
         if (!method) method = "POST";
         if (!requestxml) requestxml = null;
         
         // request object
         var req = null;
         
         // look for an empty spot in requests 
         // array due to a deleted request. You 
         // might consider moving this 
         // functionality to library code and 
         // wrapping the functionality in a 
         // data structure.
         
         // default spot is at end
         var openIndex = this.aRequests.length;
         // look for closer spot
         for (var i=0; i < this.aRequests.length; i++)
         {
            if (this.aRequests[i] == null)
            {
               openIndex = i;
               break; // stop looping
            } // end if
         }
         
         // now make the request, if possible
         if (window.XMLHttpRequest)
         {
         	if (debugajax) { alert('ajax.js:  creating XMLHttpRequest stored in openIndex:  ' + openIndex); }
            // this might look odd, but it is
            // necessary because the event 
            // handler refers to the owner of the 
            // fired event. See: 
            // www.quirksmode.org/js/this.html
            var self = this;
            req = new XMLHttpRequest();
            req.onreadystatechange = function() { self.handle() };
            // add the element to the array before 
            // doing anything that will fire 
            // readyStateChange event. If we didn't
            // do this now, we could be getting event 
            // firings from request objects that we 
            // can't find in our requsts array, when we 
            // go to handle the readyStateChange.
            this.aRequests[openIndex] = req;
         	if (debugajax) { alert('ajax.js:  creating XMLHttpRequest with method:  ' + method + '; url:  ' + url); }
            req.open(method, url, true);
            req.send(requestxml);
         }
         else if (window.ActiveXObject)
         {
            req = new ActiveXObject("Microsoft.XMLHTTP");
            if (req)
            {
               // this might look odd, but it is
               // necessary because â€˜thisâ€™ in event 
               // handlers refers to the owner of the 
               // fired event. See: 
               // www.quirksmode.org/js/this.html
               var self = this;
               req.onreadystatechange = function() { self.handle() };
               // add the element to the array before 
               // doing anything that will fire 
               // readyStateChange event. If we did not
               // do this now, we could be getting event 
               // firings from request objects that we 
               // cannoptt find in our requsts array, when
               // we go to handle the readyStateChange.
               this.aRequests[openIndex] = req;
               req.open(method, url, true);
               req.send(requestxml);
            }
            else
            {
                return false; // indicate an error
            } // end if req created
         }
         else
         {
            // no support
            return false; // indicate an error
         } // end if XMLHttpRequest/XMLHTTP support
            
         return true; // indicate no errors
      }; // end method request
    
    
   this.handle = function()
      {
         // cycle through request objects to see 
         // if any are ready with a response. we 
         // keep looping even after we find one, 
         // because it might not be the one that 
         // fired the event (there could be 
         // multiple that are ready).
         for (var i=0; i<this.aRequests.length; i++)
         {
			if (debugajax) { alert('ajax.js:  handle() is checking this.aRequests[' + i + '] --> ' + this.aRequests[i]); }         	
            // if state is "complete"
            if ( this.aRequests[i] != null && this.aRequests[i].readyState == READYSTATE_COMPLETED )
            {
				if (debugajax) { alert('ajax.js:  handle() called with readyState: ' + this.aRequests[i].readyState + '; and status:  ' + this.aRequests[i].status); }
               	if (this.aRequests[i].status == HTTP_STATUS_OK)
               {
                  // pass this off to the xml parser
                  this.parseResponse(this.aRequests[i].responseXML);

                  // remove object. this is 
                  // important because Opera 
                  // sometimes refires the 
                  // readyStateChange event.
                  // plus, this might not be the
                  // one that fired the event, and 
                  // this method might be running 
                  // twice at the same time (setting
                  // this to null is about as 'thread
                  // safe' as we can get).
                  
                  this.aRequests[i] = null;

               } // end of HTTP OK
            } // end if completed
         } // end for
      }; // end method handle
    
    
   this.setRespHandler = 
      function(sElementName, funcHandler)
      {
         // add the element handler to the hashtable
         return this.hRespHandlers.put(sElementName, funcHandler);
      }; // end method setRespHandler
    
    
   this.parseResponse = function(oNode)
      {
      	if (debugajax) { alert('ajax.js:  parseResponse called with oNode type == ' + oNode.nodeType); }
         if (!oNode) return;
         // base case (oNode is a leaf element)
         if (!oNode.hasChildNodes()) return;
	   	rootEl = oNode.documentElement;
      	if (debugajax) { alert('ajax.js:  parseResponse called with documentElement type:  ' + rootEl.nodeType); }
         
		// else, look at the parent node and select the proper handler on its basis
		 if (debugajax) { alert('ajax.js:  parseResponse called on a node with nodeName:  ' + rootEl.nodeName); }
		var elementName = rootEl.nodeName;
		// check to see whether our hashtable contains a handler for this elementName
		if ( this.hRespHandlers.containsKey(elementName) )
		{
		   // if so, fire handler, and pass 
		   // subtree starting with the node 
		   // of interest
		
		   // retreive the handler
		   var funcHandler = this.hRespHandlers.get(elementName);
		   // fire the handler and pass the 
		   // subtree as its argument
	      	if (debugajax) { alert('ajax.js:  referring element:  ' + elementName + ' to function:  ' + funcHandler); }
		   funcHandler(rootEl);
		  }
      }; // end method parseResponse
} // end class RemoteConnection