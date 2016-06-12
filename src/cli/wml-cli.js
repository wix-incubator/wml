#!/usr/bin/env node
'use strict';

require('yargs')
    .usage('$0 <cmd> [args]')
    .command(require('./wml-cli-add.js'))
    .command(require('./wml-cli-rm.js'))
    .command(require('./wml-cli-start.js'))
    .command(require('./wml-cli-list.js'))
    .command(require('./wml-cli-enable.js'))
    .command(require('./wml-cli-disable.js'))
    .help('help')
    .argv
