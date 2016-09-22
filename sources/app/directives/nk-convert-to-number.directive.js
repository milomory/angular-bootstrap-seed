/**
 * Created by niko on 22.09.16.
 *
 * @ngdoc directive
 * @name nkConvertToNumber
 * @restrict A
 */

angular.module('app').directive('nkConvertToNumber', () => ({
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, $element, $attrs, ngModel) {
        ngModel.$parsers.push(value => parseInt(value, 10));
        ngModel.$formatters.push(value => value ? value.toString() : null);
    }
}));