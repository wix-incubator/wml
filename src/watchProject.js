'use strict';

var Q = require('q');

module.exports = function (params) {
	var deferred = Q.defer();

	params.client.command(['watch-del', params.src], () =>
		params.client.command(['watch-project', params.src], (error, resp) => {
			console.log(`watching ${params.src}`);
			if (error) {
				deferred.reject(error);
			} else {
				deferred.resolve(resp);
			}
		}),
		error => deferred.reject(error));

	return deferred.promise;
}
