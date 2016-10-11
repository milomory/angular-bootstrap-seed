/**
 * Created by niko on 11.10.16.
 */

// TODO переименовать
angular.module('app').filter('sortClassIf', () => (current, value) => {
    return 'fa fa-sort' + (current.indexOf(value) != -1 ? (current == value ? '-up' : '-down') : '');
});