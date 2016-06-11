'use strict';

var extend = require('extend');
var Q = require('q');

module.exports = function (params) {
    var deferred = Q.defer();

    params.client.command(['get-config', params.config.projectPath], (error, resp) => {
        if (error) {
            deferred.reject(error);
            return;
        }

        console.log('[watch-config]'.green, resp.config);

        deferred.resolve(extend(params, {
            getConfig: resp
        }));
    });

    return deferred.promise;
}

