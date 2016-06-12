'use strict';

require('colors');

var capabilityCheck = require('../capabilityCheck.js');
var watchProject = require('../watchProject.js');
var getConfig = require('../getConfig.js');
var subscribe = require('../subscribe.js');
var watchman = require('fb-watchman');
var watchers = require('../watchers.js');

exports.command = 'start';

exports.describe = 'Starts watching all links';

exports.builder = {};

exports.handler = function () {
	watchers.load();

	for (var i in watchers.data) {
		var watcher = watchers.data[i],
		    params = {};

		if (watcher.enabled) {
			params.config = {
				projectPath: watcher.src,
				destPath: watcher.dest
			};
			params.client = new watchman.Client();

			capabilityCheck(params)
				.then(watchProject)
				.then(getConfig)
				.then(subscribe)
				.then(() => {}, (err) => {
					console.log('[error]'.red, err.watchmanResponse.error);
				});
		}
	}
};
