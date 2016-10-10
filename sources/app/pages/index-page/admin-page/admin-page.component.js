/**
 * Created by niko on 10.10.16.
 */

angular.module('app').config($stateProvider => {
    $stateProvider.state({
        name: 'index.admin',
        url: '/admin',
        component: 'adminPage'
    });
}).component('adminPage', {
    template: '<ui-view></ui-view>'
});