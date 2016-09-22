/**
 * Created by niko on 22.09.16.
 *
 * @ngdoc component
 * @name nkSearchForm
 * @param ngModel
 * @param ngChange
 */

angular.module('app').component('nkSearchForm', {
    bindings: {
        ngModel: '=',
        ngChange: '&'
    },
    template: require('./nk-search-form.component.html')
});