'use strict';

System.register([], function (_export, _context) {
    "use strict";

    var numericRegex, pToO;


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
        var props = splitEscaped(path, '.');
        var key = props.pop();
        obj = props.reduce(function (newObj, prop) {
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
        var escapeFlag = false,
            token = '',
            result = [];
        src.split('').forEach(function (letter) {
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
        if (['true', 'false'].indexOf(value) !== -1) {
            return value === 'true';
        }
        // Is it float parsable and short enough to not lose precision
        if (numericRegex.test(value) && value.length < 15) {
            return parseFloat(value);
        }
        return value;
    }

    /**
     * Validates whether the line is a comment (prefixed by # or !)
     * @param line {String} the line
     * @returns {Boolean} whether the line is a comment
     */
    function isLineComment(line) {
        return (/^\s*(\#|\!|$)/.test(line)
        );
    }

    /**
     * Validates whether the line has continuation character (backslash) at end
     * @param line {String} the line
     * @returns {Boolean} whether the line is continued on the next line
     */
    function isLineContinued(line) {
        return (/(\\\\)*\\$/.test(line)
        );
    }

    /**
     * Parses the line to a key and value
     * @param line {String} the line
     * @returns {Array} array with following structure: [line, key, value]
     */
    function parseLine(line) {
        return (/^\s*((?:[^\s:=\\]|\\.)+)\s*[:=\s]\s*(.*)$/.exec(line)
        );
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
        return Object.keys(obj).reduce(function (nested, key) {
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
        return lines.reduce(function (acc, cur) {
            var line = acc[acc.length - 1];
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
        return lines.map(function (line) {
            return line.replace(/^\s*/, '');
        }); // remove space at start of line
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
        Object.keys(obj).forEach(function (key) {
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

    function propertiesToObject(propertiesFile) {
        if (typeof propertiesFile !== 'string') {
            throw new Error('Cannot parse java-properties when it is not a string');
        }

        return pToO(propertiesFile);
    }

    _export('propertiesToObject', propertiesToObject);

    return {
        setters: [],
        execute: function () {
            numericRegex = /^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/;
            pToO = compose(makeDeepStructure, parseValues, parseLines, combineMultiLines, filterOutComments, removeLeadingWhitespace, makeLines);

            _export('default', propertiesToObject);
        }
    };
});
