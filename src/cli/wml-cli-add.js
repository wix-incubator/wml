'use strict';
var watchers = require('../watchers.js');
var path = require('path');
var untildify = require('untildify');

exports.command = 'add <src> <dest>';

exports.describe = 'Adds a link';

exports.builder = {};

exports.handler = function (argv) {
	watchers.load();
	var i,
	    src = path.resolve(untildify(argv.src)),
	    dest = path.resolve(untildify(argv.dest));

	for (i in watchers.data) {
		if (watchers.data[i].src === src) {
			console.log('Error: a watcher with the same source already exists');
			return;
		}
	}

	i = 0;
	while (watchers.data[i]) i++;

	watchers.data[i] = {
		src: src,
		dest: dest,
		enabled: true,
		createdTime: new Date()
	};

	watchers.save();
	console.log(`Added watcher: (${i}) ${src} -> ${dest}`);
}
