!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.JavaProperties=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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

function propertiesToObject(propertiesFile) {
    var propertyMap, returnMap, lines, currentLine, matches;

    if (typeof propertiesFile !== 'string') {
        throw new Error('Cannot parse java-properties when it is not a string');
    }

    propertyMap = {};
    returnMap = {};
    lines = propertiesFile.split(/\r?\n/);
    currentLine = '';

    lines.forEach(function (line) {
        var nkey, nvalue;

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
            nkey = matches[1];
            nvalue = matches[2];

            propertyMap[nkey] = nvalue;

            currentLine = '';
        }
    });


    Object.keys(propertyMap).forEach(function (key) {
        assignProperty(returnMap, key, parseValue(propertyMap[key]));
    }, this);

    return returnMap;
}

exports.propertiesToObject = propertiesToObject;exports["default"] = propertiesToObject;
},{}]},{},[1])
(1)
});