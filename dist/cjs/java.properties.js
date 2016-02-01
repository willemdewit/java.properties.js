"use strict";
function assignProperty(obj, path, value) {
    var props, i, prop;
    props = path.split('.');

    for (i = 0; i < props.length - 1; i++) {
        prop = props[i];
        if (!obj[prop]) {
            obj[prop] = {};
        }
        obj = obj[prop];
    }

    obj[props[i]] = value;
}

/**
 * Tries to parse the value to a primitive type
 * @param value {String} value to parse
 * @returns {Boolean|Number|String} parsed value
 */
function parseValue(value) {
    if (['true', 'false'].indexOf(value) > -1) {
        return value === 'true';
    }
    // is it float parseble?
    var parsed = parseFloat(value);
    if (!isNaN(parsed)) {
        return parsed;
    }
    return value;
}

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

function makeDeepStructure(obj) {
    var returnMap = {};
    Object.keys(obj).forEach(function (key) {
        assignProperty(returnMap, key, parseValue(obj[key]));
    }, this);
    return returnMap;
}

/**
 * Combines lines which end with a backslash with the next line
 * @param lines {String[]}
 * @returns {String[]}
 */
function combineMultiLines(lines) {
    return lines.slice().map(function (line, idx, arr) {
        if (isLineContinued(line)) { // line ends with an odd number of '\' (backslash)
            line = line.replace(/\\$/, ''); // line ends with continuation character
            line += arr[idx + 1];
            arr.splice(idx, 1);
        }
        return line;
    }).filter(Boolean);
}

/**
 * Removes leading white-space of every line
 * @param lines {String[]}
 * @returns {String[]}
 */
function removeLeadingWhitespace(lines) {
    return lines.map(function (line) {
        return line.replace(/^\s*/, ''); // remove space at start of line
    });
}

/**
 * Filters out the comment lines
 * @param lines {String[]}
 * @returns {String[]}
 */
function filterOutComments(lines) {
    return lines.filter(function (line) {
        return !isLineComment(line);
    });
}

/**
 * Parses the lines add adds the key-values to the return object
 * @param lines {String[]}
 * @returns {{}} the parsed key-value pairs
 */
function parseLines(lines) {
    var propertyMap = {};
    lines.forEach(function (line) {
        var parsed = parseLine(line);
        propertyMap[parsed[1]] = parsed[2];
    });
    return propertyMap;
}

function propertiesToObject(propertiesFile) {
    var returnMap, lines;

    if (typeof propertiesFile !== 'string') {
        throw new Error('Cannot parse java-properties when it is not a string');
    }

    lines = propertiesFile.split(/\r?\n/);
    lines = removeLeadingWhitespace(lines);
    lines = filterOutComments(lines);
    lines = combineMultiLines(lines);

    returnMap = makeDeepStructure(parseLines(lines));

    return returnMap;
}

exports.propertiesToObject = propertiesToObject;exports["default"] = propertiesToObject;