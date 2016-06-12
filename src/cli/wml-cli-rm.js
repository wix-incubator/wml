'use strict';
var links = require('../links.js');

exports.command = 'rm <linkId>';

exports.describe = 'Removes a link';

exports.builder = {};

exports.handler = function (argv) {
	links.load();

	var link = links.data[argv.linkId]
	if (link) {
		delete links.data[argv.linkId];
		console.log(`Discarded link: (${argv.linkId}) ${link.src} -> ${link.dest}`);
		links.save();
	} else {
		console.log(`Error: could not find link ${argv.linkId}`);
	}
}
