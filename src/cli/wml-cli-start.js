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

function onWatchersChange(onChange, resp) {
	if (resp.subscription === 'mysubscription') {
		var hasWatchersChanged = resp.files.some(function (file) {
			return file.name === 'watchers.json'
		});

		if (hasWatchersChanged) {
			onChange();
		}
	}
}

function watchForWatcherChanges(onChange) {
	var watchersPath = path.resolve(__dirname, '../');
	return subscribe({
		client: new watchman.Client(),
		watch: watchersPath,
		src: watchersPath,
		handler: onWatchersChange.bind(this, onChange)
	});
}

exports.handler = () => {
	watchers.load();

	watchForWatcherChanges(() => {
		console.log('change!');
	});

	for (var i in watchers.data) {
		var watcher = watchers.data[i];

		if (watcher.enabled) {
			var client = new watchman.Client(),
			    relativePath,
			    watch;

			capabilityCheck({
				client: client
			}).then(() => {

				return watchProject({
					client: client,
					src: watcher.src
				});

			}).then((resp) => {

				if ('warning' in resp) {
					console.log('[watch-warning]'.yellow, resp.warning);
				}

				console.log('[watch]'.green, resp.watch);

				relativePath = resp.relative_path;
				watch = resp.watch;

				return getConfig({
					client: client,
					src: watcher.src
				});

			}).then((resp) => {

				console.log('[watch-config]'.green, resp.config);

				return subscribe({
					client: client,
					watch: watch,
					relativePath: relativePath,
					src: watcher.src,
					handler: copyHandler({
						src: watcher.src,
						dest: watcher.dest
					})
				});

			}).then(() => {
				console.log('[subscribe]'.green, watcher.src);
			}, (err) => {

				client.end();

				var error = err.watchmanResponse
					? err.watchmanResponse.error
					: err;

				console.log('[error]'.red, error);

				throw err;

			}).done();
		}
	}
};
