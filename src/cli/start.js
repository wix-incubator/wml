'use strict';

require('colors');

var path = require('path');

var capabilityCheck = require('../capabilityCheck.js');
var watchProject = require('../watchProject.js');
var getConfig = require('../getConfig.js');
var subscribe = require('../subscribe.js');
var watchman = require('fb-watchman');
var links = require('../links.js');
var copyHandler = require('../handlers/copy.js');

exports.command = 'start';

exports.describe = 'Starts watching all links';

exports.builder = {};

function onLinksChange(onChange, resp) {
	if (resp.subscription === 'mysubscription') {
		var hasLinksChanged = resp.files.some(function (file) {
			return file.name === 'links.json'
		});

		if (hasLinksChanged) {
			onChange();
		}
	}
}

function watchForLinkChanges(onChange) {
	var linksPath = path.resolve(__dirname, '../');
	return subscribe({
		client: new watchman.Client(),
		watch: linksPath,
		src: linksPath,
		handler: onLinksChange.bind(this, onChange)
	});
}

exports.handler = () => {
	links.load();

	watchForLinkChanges(() => {
		console.log('change!');
	});

	for (var i in links.data) {
		var link = links.data[i];

		if (link.enabled) {
			var client = new watchman.Client(),
			    relativePath,
			    watch;

			capabilityCheck({
				client: client
			}).then(() => {

				return watchProject({
					client: client,
					src: link.src
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
					src: link.src
				});

			}).then((resp) => {

				console.log('[watch-config]'.green, resp.config);

				return subscribe({
					client: client,
					watch: watch,
					relativePath: relativePath,
					src: link.src,
					handler: copyHandler({
						src: link.src,
						dest: link.dest
					})
				});

			}).then(() => {
				console.log('[subscribe]'.green, link.src);
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
