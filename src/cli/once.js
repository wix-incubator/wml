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

exports.command = 'once';

exports.describe = 'Updates all links once';

exports.builder = {};

function startWatcher(link) {
	if (!link.enabled) {
		return;
	}

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
				dest: link.dest,
				onExecuted : function()
				{
					stopWatcher(client, link.src, link.dest);
				}
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

	return client;
}

function stopWatcher(watcher, src, dest) {
	watcher.end();
	console.log('[end]'.green, src, '->' , dest);
}

function runLinksOnce()
{
	var i;

	links.load();

	if (Object.keys(links.data).length) {
		// Create new watchers and change current watchers state
		//
		for (i in links.data) {
			var link = links.data[i];
			startWatcher(link);
		}
	}else {
		console.log('[warning]'.yellow, 'no links set');
	}
}

exports.handler = () => {
	runLinksOnce();
};
