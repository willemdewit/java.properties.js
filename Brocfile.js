var distes6 = require('broccoli-dist-es6-module');
module.exports = distes6('lib', {
	packageName : 'java-properties',
	main : 'java.properties',
	global : 'JavaProperties'
});