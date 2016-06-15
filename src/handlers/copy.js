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

				if (f.exists) {
					console.log('[copy]', src, '->', dest);
					fs.copy(src, dest);
				} else {
					console.log('[delete]', dest);
					fs.remove(dest);
				}
			}
		}
	}
}
