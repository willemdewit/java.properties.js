(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['exports'], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.javaProperties = mod.exports;
    }
})(this, function (exports) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.propertiesToObject = propertiesToObject;

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

    function parseValue(value) {
        if (['true', 'false'].indexOf(value) > -1) {
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
        var returnMap = {};
        Object.keys(obj).forEach(function (key) {
            assignProperty(returnMap, key, parseValue(obj[key]));
        }, this);
        return returnMap;
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
                throw 'Cannot parse line: ' + line;
            }

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

    exports.default = propertiesToObject;
});
