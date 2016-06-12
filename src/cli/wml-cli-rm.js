'use strict';
var watchers = require('../watchers.js');

exports.command = 'rm <linkId>';

exports.describe = 'Removes a link';

exports.builder = {};

exports.handler = function (argv) {
	watchers.load();

	var watcher = watchers.data[argv.linkId]
	if (watcher) {
		delete watchers.data[argv.linkId];
		console.log(`Discarded watcher: (${argv.linkId}) ${watcher.src} -> ${watcher.dest}`);
		watchers.save();
	} else {
		console.log(`Error: could not find watcher ${argv.linkId}`);
	}
}
