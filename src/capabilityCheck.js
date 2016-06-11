'use strict';

var extend = require('extend');
var Q = require('q');

module.exports = function (params) {
    var deferred = Q.defer();

    params.client.capabilityCheck({optional:[], required:['relative_root']}, (error, resp) => {
        if (error) {
            console.log(error);
            deferred.reject(error);
            params.client.end();
        }

        deferred.resolve(extend(params, {
            capabilityCheck: resp
        }));
    });

    return deferred.promise;
}
