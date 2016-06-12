'use strict';

var extend = require('extend');
var Q = require('q');

module.exports = function (handler) {
	return function (params) {
		var deferred = Q.defer();

		var sub = {
			expression: [
				'allof',
				['match', '*'],
			],
			fields: ['name', 'size', 'exists', 'type']
		};

		if (params.watchProject.relative_path) {
			sub.relative_root = params.watchProject.relative_path;
		}

		params.client.command([
			'subscribe',
			params.watchProject.watch,
			'mysubscription',
			sub
		], (error, resp) => {
			if (error) {
				// Probably an error in the subscription criteria
				console.error('failed to subscribe: ', error);
				deferred.reject(error);
				return;
			}
			console.log('[subscribe]'.green, params.config.src);
			deferred.resolve(extend(params, {
				subscribe: resp
			}));
		});

		params.client.on('subscription', function (resp) {
			if (resp.subscription == 'mysubscription') {
				handler(resp);
			}
		});

		return deferred.promise;
	}
};
