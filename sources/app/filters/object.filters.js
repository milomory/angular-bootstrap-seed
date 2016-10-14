/**
 * Created by niko on 14.10.16.
 *
 * @ngdoc filter
 * @name keys
 *
 */
angular.module('app').filter('keys', () => input =>
    angular.isObject(input) ? Object.keys(input) : []
);