'use strict';
var links = require('../links.js');
var path = require('path');
var untildify = require('untildify');

exports.command = 'add <src> <dest>';

exports.describe = 'Adds a link';

exports.builder = {};

exports.handler = function (argv) {
	links.load();
	var i,
	    src = path.resolve(untildify(argv.src)),
	    dest = path.resolve(untildify(argv.dest));

	for (i in links.data) {
		if (links.data[i].src === src) {
			console.log('Error: a link with the same source already exists');
			return;
		}
	}

	i = 0;
	while (links.data[i]) i++;

	links.data[i] = {
		src: src,
		dest: dest,
		enabled: true,
		createdTime: new Date()
	};

	links.save();
	console.log(`Added link: (${i}) ${src} -> ${dest}`);
}
