'use strict';
var links = require('../links.js');

exports.command = 'rm <linkId>';

exports.describe = 'Removes a link';

exports.builder = {};

exports.handler = function (argv) {
	links.load();

	if (argv.linkId === 'all') {
		Object.keys(links.data).forEach(linkId => {
			var link = links.data[linkId];
			delete links.data[linkId];
			console.log(`Discarded link: (${linkId}) ${link.src} -> ${link.dest}`);
		})
		links.save();
	} else {
		var link = links.data[argv.linkId]
		if (link) {
			delete links.data[argv.linkId];
			console.log(`Discarded link: (${argv.linkId}) ${link.src} -> ${link.dest}`);
			links.save();
		} else {
			console.log(`Error: could not find link ${argv.linkId}`);
		}
	}
}
