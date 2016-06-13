'use strict';

var Q = require('q');
var uuid = require('uuid-js');

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

	var subscriptionId = uuid.create().toString();

	params.client.command([
		'subscribe',
		params.watch,
		subscriptionId,
		sub
	], (error, resp) => {
		if (error) {
			deferred.reject(error);
		} else {
			deferred.resolve(resp);
		}
	});

	params.client.on('subscription', function (resp) {
		if (resp.subscription === subscriptionId) {
			params.handler(resp);
		}
	});

	return deferred.promise;
};
