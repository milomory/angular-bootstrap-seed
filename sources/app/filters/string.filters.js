/**
 * Created by niko on 14.10.16.
 *
 * @ngdoc filter
 * @name split
 *
 * @param {*} separator
 * @param {number} [limit]
 */
angular.module('app').filter('split', () => (input, separator, limit) =>
    angular.isString(input) ? input.split(separator, limit) : []
);

/**
 * Created by niko on 14.10.16.
 *
 * @ngdoc truncate
 * @name split
 *
 * @param {number} length
 * @param {boolean} [preserve]
 */
angular.module('app').filter('truncate', () => (input, length, preserve = false) =>
    angular.isString(input) ? input.substr(0, preserve ? input.indexOf(' ', length) : length) + '...' : ''
);