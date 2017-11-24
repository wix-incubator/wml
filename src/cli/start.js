'use strict';

require('colors');

var path = require('path');

var capabilityCheck = require('../capabilityCheck.js');
var watchProject = require('../watchProject.js');
var watchDel = require('../watchDel.js')
var getConfig = require('../getConfig.js');
var subscribe = require('../subscribe.js');
var watchman = require('fb-watchman');
var links = require('../links.js');
var copyHandler = require('../handlers/copy.js');
var fs = require('fs-extra')

exports.command = 'start';

exports.describe = 'Starts watching all links';

exports.builder = {};

function onLinksChange(onChange, resp) {
	var hasLinksChanged = resp.files.some(function (file) {
		return file.name === 'links.json'
	});

	if (hasLinksChanged) {
		onChange();
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

var watchers = [];

function startWatcher(link, linkId) {
	if (!link.enabled) {
		return;
	}

	var client = new watchman.Client(),
	    relativePath,
	    watch;

	watchers[linkId] = client;


	capabilityCheck({
		client: client
	}).then(() => {

		console.log('Clean target'.green, link.dest)				

<<<<<<< Updated upstream
		return fs.emptyDir(link.dest);

	}).then(() => {

		return watchDel({
			client: client,
			src: link.src
=======
		return new Promise((resolve,reject)=>{
			fs.emptyDir(link.dest);
			setTimeout(()=>resolve(), 500)
		})

	}).then(() => {

		console.log('Deleting old watch'.green, link.src)				

		return watchDel({
			client: client,
			src: link.src
		}).catch((err)=>{
			console.log("...already deleted")
>>>>>>> Stashed changes
		});

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

	return client;
}

function stopWatcher(watcher, src, dest) {
	watcher.end();
	console.log('[end]'.green, src, '->' , dest);
}

function updateWatchers() {
	var prevLinks = links.data,
	    i;

	links.load();

	// Create new watchers and change current watchers state
	//
	for (i in links.data) {
		var link = links.data[i],
		    prevLink = prevLinks[i] || {};

		if (!prevLink.enabled && link.enabled) {
			watchers[i] = startWatcher(links.data[i], i);
		} else if (prevLink.enabled && !link.enabled) {
			stopWatcher(watchers[i], link.src, link.dest);
			delete watchers[i];
		}

		delete prevLinks[i];
	}

	// Turn off all previous watchers that didn't exists in current links list
	//
	for (i in prevLinks) {
		stopWatcher(watchers[i], link.src, link.dest);
		delete watchers[i];
	}
}

exports.handler = () => {
	watchForLinkChanges(updateWatchers);
};
