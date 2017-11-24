'use strict';
require('colors');
const fs = require('fs-utils')
const glob = require('glob')
const _ = require('lodash')
var links = require('../links.js');
const add = require('./add.js').handler
const sequential = require('promise-sequential')

exports.command = 'autoAdd';

exports.describe = 'Auto-discovers and creates links';

exports.builder = {};

exports.handler = function () {
	links.load();

	var found;

	console.log('Links:');

	let p = new Promise((resolve, reject) => {

	})
	let sources = []
	for (var linkId in links.data) {
		var link = links.data[linkId];
		var status = link.enabled ? 'enabled'.green : 'disabled'.red;
		sources.push(link.src)
	}
	sources = _.uniqBy(sources, v => v)
	let scanners = []
	let mappings = {}
	_.each(sources, src => {
		let pkg = fs.readJSONSync(`${src}/package.json`)
		let name = pkg.name
		console.log(`Scanning for ${name}`);
		let p = new Promise((resolve, reject) => {
			let pat = `${process.cwd()}/**/node_modules/${name}`
			mappings[src] = []
			glob(pat, {}, function (er, files) {
				_.each(files, f=>{
					mappings[src].push(f) 
				})
				resolve()
			})
		})
		scanners.push(p)
	})
	Promise.all(scanners).then(()=>{
		let adds = []
		_.each(mappings, (dsts,src)=>{
			_.each(dsts, dest=>{
				adds.push(()=>add({src,dest}))
			})
		})
		sequential(adds)
	})


}
