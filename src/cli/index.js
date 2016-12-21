#!/usr/bin/env node
'use strict';

var add = require('./add.js');
var rm = require('./rm.js');
var start = require('./start.js');
var list = require('./list.js');
var enable = require('./enable.js');
var disable = require('./disable.js');

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
	.command('en [linkId]', false, enable)
	.command('d [linkId]', false, disable)
	.help('help')
	.argv
