'use strict';
var inquirer = require('inquirer');
var links = require('../links.js');

exports.start = () => {
	let choices = Object.keys(links.data)
		.map(id => {
			let link = links.data[id];
			return {
				name: ` (${id}) ${link.src} -> ${link.dest}`,
				id: id,
			}
		});

	let defaults = Object.keys(links.data)
		.filter(id => links.data[id].enabled)
		.map(id => {
			let link = links.data[id];
			return ` (${id}) ${link.src} -> ${link.dest}`;
		});

	inquirer.prompt([{
		type: 'checkbox',
		message: 'Select links',
		name: 'links',
		choices: choices,
		default: defaults
	}]).then(results => {
		Object.keys(links.data)
			.forEach(id => links.data[id].enabled = false);

		results.links
			.map(result => result.match(/ \((\d+)\)/)[1])
			.forEach(id => links.data[id].enabled = true)

		links.save();
	})

}
