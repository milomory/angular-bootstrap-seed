/**
 * Created by niko on 21.09.16.
 */

angular.module('app').config($stateProvider => {
    $stateProvider.state({
        name: 'auth',
        url: '/auth',
        component: 'authPage'
    });
}).component('authPage', {
    template: require('./auth-page.component.html'),
    controller: function ($scope, $state, authService) {
        $scope.$on('errorMessage', (event, message) => this.errorMessage = message);
        $scope.$on('loading', (event, loading) => this.loading = loading);

        this.signin = () => authService.signin(this.user).then(() => $state.go('index'));
        this.signup = () => authService.signup(this.user).then(() => $state.go('index'));
    }
});