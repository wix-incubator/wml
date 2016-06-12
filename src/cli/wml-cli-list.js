'use strict';
require('colors');
var watchers = require('../watchers.js');

exports.command = 'list';

exports.describe = 'Lists all links';

exports.builder = {};

exports.handler = function () {
	watchers.load();

	var found;

	console.log('Watchers:');

	for (var linkId in watchers.data) {
		var watcher = watchers.data[linkId];
		var status = watcher.enabled ? 'enabled'.green : 'disabled'.red;
		console.log(`[${status}] (${linkId}) ${watcher.src} -> ${watcher.dest}`);
		found = true;
	}

	if (!found) {
		console.log('(no watchers set)');
	}
}
