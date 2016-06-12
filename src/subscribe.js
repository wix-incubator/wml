'use strict';

var Q = require('q');

module.exports = function (params) {
	var deferred = Q.defer();

	var sub = {
		expression: [
			'allof',
			['match', '*'],
		],
		fields: ['name', 'size', 'exists', 'type']
	};

	if (params.relativePath) {
		sub.relative_root = params.relativePath;
	}

	params.client.command([
		'subscribe',
		params.watch,
		'mysubscription',
		sub
	], (error, resp) => {
		if (error) {
			deferred.reject(error);
		} else {
			deferred.resolve(resp);
		}
	});

	params.client.on('subscription', function (resp) {
		if (resp.subscription == 'mysubscription') {
			params.handler(resp);
		}
	});

	return deferred.promise;
};
