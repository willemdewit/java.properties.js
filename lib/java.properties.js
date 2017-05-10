function compose() {
    var fns = arguments;

    return function (result) {
        for (var i = fns.length - 1; i > -1; i--) {
            result = fns[i].call(this, result);
        }

        return result;
    };
}

function assignProperty(obj, path, value) {
    const props = splitEscaped(path, '.');
    const key = props.pop();
    obj = props.reduce((newObj, prop) => {
        if (!newObj[prop]) {
            newObj[prop] = {};
        }
        return newObj[prop];
    }, obj);

    obj[key] = value;
}

/**
 * Split a string using a separator, if not preceded by a backslash.
 * For simplicity, this does not correctly handle two preceding backslashes
 * @param src {String} value to parse
 * @param separator {String} single character separator
 * @returns []
 */
function splitEscaped(src, separator) {
    let escapeFlag = false,
        token = '',
        result = [];
    src.split('').forEach(letter => {
        if (escapeFlag) {
            token += letter;
            escapeFlag = false;
        } else if (letter === '\\') {
            escapeFlag = true;
        } else if (letter === separator) {
            result.push(token);
            token = '';
        } else {
            token += letter;
        }
    });
    if (token.length > 0) {
        result.push(token);
    }
    return result;
}

/**
 * Tries to parse the value to a primitive type. It converts "true" and "false" to a boolean, and "2" to a number.
 * @param value {String} value to parse
 * @returns {Boolean|Number|String} parsed value
 */
function parseValue(value) {
    if (['true', 'false'].includes(value)) {
        return value === 'true';
    }
    // is it float parsable?
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
        return parsed;
    }
    value = encodeEscapedUnicodeChars(value);
    return value; 
} 
 
/** 
 * @method encodeEscapedUnicodeChars 
 * @param stringToEncode {String} value to encode (e.g. \u00FD) 
 * @returns string with  replaced \u<xxxx> sequences OR the original input 
 */ 
function encodeEscapedUnicodeChars(stringToEncode) { 
    if (typeof stringToEncode === 'string') { 
        return stringToEncode.replace(/\\u[0-9a-fA-F]{4}/g, function(value) { 
            return JSON.parse('"' + value + '"'); 
        }); 
    } 
    return stringToEncode; 
}; 

/**
 * Validates whether the line is a comment (prefixed by # or !)
 * @param line {String} the line
 * @returns {Boolean} whether the line is a comment
 */
function isLineComment(line) {
    return /^\s*(\#|\!|$)/.test(line);
}

/**
 * Validates whether the line has continuation character (backslash) at end
 * @param line {String} the line
 * @returns {Boolean} whether the line is continued on the next line
 */
function isLineContinued(line) {
    return /(\\\\)*\\$/.test(line);
}

/**
 * Parses the line to a key and value
 * @param line {String} the line
 * @returns {Array} array with following structure: [line, key, value]
 */
function parseLine(line) {
    return /^\s*((?:[^\s:=\\]|\\.)+)\s*[:=\s]\s*(.*)$/.exec(line);
}

/**
 * Makes a deep structured object from a shallow object with dot-separated keys:
 *   { "key.with.nesting": "value" }
 *   becomes:
 *   { "key": { "with": { "nesting": "value" } } }
 * @param obj
 * @returns {{}}
 */
function makeDeepStructure(obj) {
    return Object.keys(obj).reduce((nested, key) => {
        assignProperty(nested, key, obj[key]);
        return nested;
    }, {});
}

/**
 * Combines lines which end with a backslash with the next line
 * @param lines {String[]}
 * @returns {String[]}
 */
function combineMultiLines(lines) {
    return lines.reduce((acc, cur) => {
        const line = acc[acc.length - 1];
        if (acc.length && isLineContinued(line)) {
            acc[acc.length - 1] = line.replace(/\\$/, '');
            acc[acc.length - 1] += cur;
        } else {
            acc.push(cur);
        }
        return acc;
    }, []);
}

/**
 * Removes leading white-space of every line
 * @param lines {String[]}
 * @returns {String[]}
 */
function removeLeadingWhitespace(lines) {
    return lines.map((line) => line.replace(/^\s*/, '') ); // remove space at start of line
}

/**
 * Filters out the comment lines
 * @param lines {String[]}
 * @returns {String[]}
 */
function filterOutComments(lines) {
    return lines.filter((line) => !isLineComment(line) );
}

/**
 * Parses the lines add adds the key-values to the return object
 * @param lines {String[]}
 * @returns {{}} the parsed key-value pairs
 */
function parseLines(lines) {
    var propertyMap = {};
    lines.forEach((line) => {
        const parsed = parseLine(line);
        if (!parsed) {
            throw new Error('Cannot parse line: ', line);
        }
        propertyMap[parsed[1]] = parsed[2];
    });
    return propertyMap;
}

/**
 * Loops over the object values and tries to parse them to a native value.
 * @param obj
 * @returns {Object} the same object as the argument
 */
function parseValues(obj) {
    Object.keys(obj).forEach((key) => {
        obj[key] = parseValue(obj[key]);
    });
    return obj;
}

/**
 * Makes an array of strings from a string containing return-characters.
 * @param str
 * @returns {Array} array of lines
 */
function makeLines(str) {
    return str.split(/\r?\n/);
}

const pToO = compose(
    makeDeepStructure,
    parseValues,
    parseLines,
    combineMultiLines,
    filterOutComments,
    removeLeadingWhitespace,
    makeLines
);

export function propertiesToObject(propertiesFile) {
    if (typeof propertiesFile !== 'string') {
        throw new Error('Cannot parse java-properties when it is not a string');
    }

    return pToO(propertiesFile);
}

export default propertiesToObject;