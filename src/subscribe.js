'use strict';

var extend = require('extend');
var Q = require('q');
var path = require('path');
var fs = require('fs-extra');

module.exports = function (params) {
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
        console.log('[subscribe]'.green, params.config.projectPath);
        deferred.resolve(extend(params, {
            subscribe: resp
        }));
    });

    params.client.on('subscription', function (resp) {
        for (var i in resp.files) {
            var f = resp.files[i];
            if (resp.subscription == 'mysubscription') {
                if (f.type === 'f') {
                    var src = path.join(params.config.projectPath, f.name),
                        dest = path.join(params.config.destPath, f.name);

                    console.log('[copy]', src, '->', dest);
                    // console.log('[copy]', f.name);
                    fs.copy(src, dest);
                }
            }
        }
    });

    return deferred.promise;
}
