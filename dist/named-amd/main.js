define("java-properties",
  ["exports"],
  function(__exports__) {
    "use strict";
    function propertiesToObject(propertiesFile) {
    	var propertyMap = {},
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
    	
    	return propertyMap;
    };
    __exports__.propertiesToObject = propertiesToObject;__exports__["default"] = propertiesToObject;
  });