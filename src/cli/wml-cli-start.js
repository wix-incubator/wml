'use strict';

require('colors');

var path = require('path');

var capabilityCheck = require('../capabilityCheck.js');
var watchProject = require('../watchProject.js');
var getConfig = require('../getConfig.js');
var subscribe = require('../subscribe.js');
var watchman = require('fb-watchman');
var watchers = require('../watchers.js');
var copyHandler = require('../handlers/copy.js');

exports.command = 'start';

exports.describe = 'Starts watching all links';

exports.builder = {};

function watchForWatcherChanges(onChange) {
	subscribe(function(resp) {
		if (resp.subscription === 'mysubscription') {
			var hasWatchersChanged = resp.files.some(function (file) {
				return file.name === 'watchers.json'
			});

			if (hasWatchersChanged) {
				onChange();
			}
		}
	})({
		watchProject: {
			watch: path.resolve(__dirname, '../')
		},
		client: new watchman.Client(),
		config: {
			src: path.resolve(__dirname, '../')
		}
	});
}

exports.handler = function () {
	watchers.load();

	watchForWatcherChanges(function () {
		console.log('change!');
	});

	for (var i in watchers.data) {
		var watcher = watchers.data[i],
		    params = {};

		if (watcher.enabled) {
			params.config = {
				src: watcher.src,
				dest: watcher.dest
			};
			params.client = new watchman.Client();

			capabilityCheck(params)
				.then(watchProject)
				.then(getConfig)
				.then(subscribe(copyHandler({
					src: watcher.src,
					dest: watcher.dest
				})))
				.then(() => {}, (err) => {
					var error = err.watchmanResponse
						? err.watchmanResponse.error
						: err;

					console.log('[error]'.red, error);
				});
		}
	}
};
