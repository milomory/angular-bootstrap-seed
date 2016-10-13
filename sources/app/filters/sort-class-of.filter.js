/**
 * Created by niko on 13.10.16.
 */

// TODO переименовать
angular.module('app').filter('sortClassOf', () => (param, field) => {
    return 'fa fa-sort' + (param.indexOf(field) != -1 ? '-' + (param == field ? 'up' : 'down') : '');
});