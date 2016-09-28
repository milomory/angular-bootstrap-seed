/**
 * Created by niko on 28.09.16.
 */

angular.module('app').config($stateProvider => {
    $stateProvider.state({
        name: 'error',
        url: '/error',
        component: 'errorPage'
    })
}).component('errorPage', {
    template: require('./error-page.component.html'),
    controller: function ($scope) {
        // TODO неработает
        $scope.$on('errorMessage', (event, message) => this.errorMessage = message);
        $scope.$on('loading', (event, loading) => this.loading = loading);
    }
});