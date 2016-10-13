/**
 * Created by niko on 13.10.16.
 */

// TODO переименовать
angular.module('app').filter('setSortValue', () => (param, value) => (param == value ? '-' : '') + value);