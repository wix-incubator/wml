'use strict';

var Q = require('q');

module.exports = function (params) {
	var deferred = Q.defer();

	params.client.command(['watch-del', params.src], (error, resp) => {
		if (error) {
			deferred.reject(error);
		} else {
			deferred.resolve(resp);
		}

	});

	return deferred.promise;
}
