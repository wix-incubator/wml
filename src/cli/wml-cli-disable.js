'use strict';
var watchers = require('../watchers.js');

exports.command = 'disable <linkId>';

exports.describe = 'Disables a link';

exports.builder = {};

exports.handler = function (argv) {
	watchers.load();

	var watcher = watchers.data[argv.linkId]
	if (watcher) {
		watchers.data[argv.linkId].enabled = false;
		console.log(`Disabled watcher: (${argv.linkId}) ${watcher.src} -> ${watcher.dest}`);
		watchers.save();
	} else {
		console.log(`Error: could not find watcher ${argv.linkId}`);
	}
}
