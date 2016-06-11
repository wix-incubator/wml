'use strict';
var watchers = require('../watchers.js');

exports.command = 'enable <linkId>';

exports.describe = 'Enables a link';

exports.builder = {};

exports.handler = function (argv) {
	watchers.load();

	var watcher = watchers.data[argv.linkId]
	if (watcher) {
		watchers.data[argv.linkId].enabled = true;
		console.log(`Enabled watcher: (${argv.linkId}) ${watcher.src} -> ${watcher.dest}`);
		watchers.save();
	} else {
		console.log(`Error: could not find watcher ${argv.linkId}`);
	}
}
