/**
 * Created by niko on 13.10.16.
 */

angular.module('app').filter('toArray', () => value => angular.isObject(value) ? Object.keys(value) : []);