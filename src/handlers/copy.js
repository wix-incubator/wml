'use strict';

var path = require('path');
var fs = require('fs-extra');

module.exports = function (config) {
	return function (resp) {
		for (var i in resp.files) {
			var f = resp.files[i];
			if (f.type === 'f') {
				var src = path.join(config.src, f.name),
				    dest = path.join(config.dest, f.name);

				console.log('[copy]', src, '->', dest);
				// console.log('[copy]', f.name);
				fs.copy(src, dest);
			}
		}
	}
}
