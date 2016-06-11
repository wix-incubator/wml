'use strict';

var fs = require('fs-extra');
var path = require('path');

var watchersPath = path.resolve(__dirname, 'watchers.json');

module.exports.load = function() {
	var watchers;

	try {
		watchers = fs.readJsonSync(watchersPath);
	} catch (err) {
		watchers = {};
	}

	module.exports.data = watchers;
};

module.exports.save = function() {
	fs.outputJsonSync(watchersPath, module.exports.data);
};