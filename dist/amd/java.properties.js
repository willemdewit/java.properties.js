define(['exports'], function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.propertiesToObject = propertiesToObject;

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
        var props = path.split('.');
        var key = props.pop();
        obj = props.reduce(function (newObj, prop) {
            if (!newObj[prop]) {
                newObj[prop] = {};
            }

            return newObj[prop];
        }, obj);
        obj[key] = value;
    }

    function parseValue(value) {
        if (['true', 'false'].indexOf(value) !== -1) {
            return value === 'true';
        }

        var parsed = parseFloat(value);

        if (!isNaN(parsed)) {
            return parsed;
        }

        return value;
    }

    function isLineComment(line) {
        return (/^\s*(\#|\!|$)/.test(line)
        );
    }

    function isLineContinued(line) {
        return (/(\\\\)*\\$/.test(line)
        );
    }

    function parseLine(line) {
        return (/^\s*((?:[^\s:=\\]|\\.)+)\s*[:=\s]\s*(.*)$/.exec(line)
        );
    }

    function makeDeepStructure(obj) {
        return Object.keys(obj).reduce(function (nested, key) {
            assignProperty(nested, key, obj[key]);
            return nested;
        }, {});
    }

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

    function removeLeadingWhitespace(lines) {
        return lines.map(function (line) {
            return line.replace(/^\s*/, '');
        });
    }

    function filterOutComments(lines) {
        return lines.filter(function (line) {
            return !isLineComment(line);
        });
    }

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

    function parseValues(obj) {
        Object.keys(obj).forEach(function (key) {
            obj[key] = parseValue(obj[key]);
        });
        return obj;
    }

    function makeLines(str) {
        return str.split(/\r?\n/);
    }

    var pToO = compose(makeDeepStructure, parseValues, parseLines, combineMultiLines, filterOutComments, removeLeadingWhitespace, makeLines);

    function propertiesToObject(propertiesFile) {
        if (typeof propertiesFile !== 'string') {
            throw new Error('Cannot parse java-properties when it is not a string');
        }

        return pToO(propertiesFile);
    }

    exports.default = propertiesToObject;
});
