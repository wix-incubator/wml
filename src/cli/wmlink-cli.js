#!/usr/bin/env node
'use strict';

require('yargs')
    .usage('$0 <cmd> [args]')
    .command(require('./wmlink-cli-add.js'))
    .command(require('./wmlink-cli-rm.js'))
    .command(require('./wmlink-cli-start.js'))
    .command(require('./wmlink-cli-list.js'))
    .command(require('./wmlink-cli-enable.js'))
    .command(require('./wmlink-cli-disable.js'))
    .help('help')
    .argv
