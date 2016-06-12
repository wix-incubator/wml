#!/usr/bin/env node
'use strict';

var add = require('./wml-cli-add.js');
var rm = require('./wml-cli-rm.js');
var start = require('./wml-cli-start.js');
var list = require('./wml-cli-list.js');
var enable = require('./wml-cli-enable.js');
var disable = require('./wml-cli-disable.js');

require('yargs')
	.usage('$0 <cmd> [args]')
	.command(add)
	.command(rm)
	.command(start)
	.command(list)
	.command(enable)
	.command(disable)
	.command('a', false, add)
	.command('s', false, start)
	.command('ls', false, list)
	.command('en <linkId>', false, enable)
	.command('d <linkId>', false, disable)
	.help('help')
	.argv
