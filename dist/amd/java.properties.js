define(
  ["exports"],
  function(__exports__) {
    "use strict";
    function propertiesToObject(propertiesFile) {
    	var propertyMap = {},
    		returnMap = {},
    		lines = propertiesFile.split(/\r?\n/),
    		currentLine = '',
    		matches;
    	
    	lines.forEach(function(line) {
    		// check if it is a comment line
    		if (/^\s*(\#|\!|$)/.test(line)) { // line is whitespace or first non-whitespace character is '#' or '!'
    			return;
    		}
    		line = line.replace(/^\s*/, ''); // remove space at start of line
    		currentLine += line;
    		if (/(\\\\)*\\$/.test(currentLine)) { // line ends with an odd number of '\' (backslash)
    			// line ends with continuation character, remember it and don't process further
    			currentLine = currentLine.replace(/\\$/, '');
    		} else {
    			matches = /^\s*((?:[^\s:=\\]|\\.)+)\s*[:=\s]\s*(.*)$/.exec(currentLine);
    			var nkey = matches[1],
    				nvalue = matches[2];
    			
    			propertyMap[nkey] = nvalue;
    			
    			currentLine = '';
    		}
    	});
    	
    	function assignProperty(obj, path, value) {
    	    var props = path.split(".")
    	        , i = 0
    	        , prop;

    	    for(; i < props.length - 1; i++) {
    	        prop = props[i];
    	        obj = obj[prop];
    	    }
    	    
    	    obj[props[i]] = value;
    	}
    	Object.keys(propertyMap).forEach(function (key) {
    		assignProperty(returnMap, key, propertyMap[key]);
    	}, this);
    	
    	return returnMap;
    };
    __exports__.propertiesToObject = propertiesToObject;__exports__["default"] = propertiesToObject;
  });