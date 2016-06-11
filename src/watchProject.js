'use strict';

var extend = require('extend');
var Q = require('q');

module.exports = function (params) {
    var deferred = Q.defer();

    // Initiate the watch
    params.client.command(['watch-project', params.config.projectPath], (error, resp) => {
        if (error) {
            console.error('Error initiating watch:', error);
            deferred.reject(error);
            return;
        }

        if ('warning' in resp) {
            console.log('[watch-warning]'.yellow, resp.warning);
        }

        console.log('[watch]'.green, resp.watch);

        deferred.resolve(extend(params, {
            watchProject: resp
        }));
    });

    return deferred.promise;
}
