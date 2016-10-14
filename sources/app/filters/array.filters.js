/**
 * Created by niko on 14.10.16.
 *
 * @ngdoc filter
 * @name join
 *
 * @param {*} separator
 */
angular.module('app').filter('join', () => (input, separator) =>
    angular.isArray(input) ? input.join(separator) : ''
);

/**
 * Created by niko on 14.10.16.
 *
 * @ngdoc filter
 * @name map
 *
 * @param {*} expression
 */
angular.module('app').filter('map', $parse => (input, expression) =>
    angular.isArray(input) ? expression ? input.map($parse(expression)) : input : []
);