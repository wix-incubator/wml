'use strict';
var links = require('../links.js');
var interactiveSelect = require('./interactive-select.js');

exports.command = 'enable [linkId]';

exports.describe = 'Enables a link';

exports.builder = {};

exports.handler = function (argv) {
	links.load();

	if (argv.linkId === undefined) {
		interactiveSelect.start();
	} else {
		if (argv.linkId === 'all') {
			Object.keys(links.data).forEach(linkId => {
				var link = links.data[linkId];
				if (!link.enabled) {
					link.enabled = true;
					console.log(`Enabled link: (${linkId}) ${link.src} -> ${link.dest}`);
				}
			})
			links.save();
		} else {
			var link = links.data[argv.linkId]

			if (link) {
				links.data[argv.linkId].enabled = true;
				console.log(`Enabled link: (${argv.linkId}) ${link.src} -> ${link.dest}`);
				links.save();
			} else {
				console.log(`Error: could not find link ${argv.linkId}`);
			}
		}
	}
}
