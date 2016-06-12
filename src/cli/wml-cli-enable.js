'use strict';
var links = require('../links.js');

exports.command = 'enable <linkId>';

exports.describe = 'Enables a link';

exports.builder = {};

exports.handler = function (argv) {
	links.load();

	var link = links.data[argv.linkId]
	if (link) {
		links.data[argv.linkId].enabled = true;
		console.log(`Enabled link: (${argv.linkId}) ${link.src} -> ${link.dest}`);
		links.save();
	} else {
		console.log(`Error: could not find link ${argv.linkId}`);
	}
}
