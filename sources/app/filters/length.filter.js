/**
 * Created by niko on 10.10.16.
 */

angular.module('app').filter('length', () => item => item ? Object.keys(item).length : 0);