/**
 * Created by niko on 21.09.16.
 */

angular.module('app').config($stateProvider => {
    $stateProvider.state({
        name: 'index',
        url: '/index',
        component: 'indexPage'
    });
}).component('indexPage', {
    template: require('./index-page.component.html'),
    controller: function ($scope, $cookies, $state, authService, modalService) {
        $scope.$on('errorMessage', (event, message) => this.errorMessage = message);
        $scope.$on('loading', (event, loading) => this.loading = loading);

        this.currentUser = $cookies.getObject('currentUser');
        this.signout = () => authService.signout().then(() => $state.go('auth'));

        this.showUserModal = () => {
            modalService.showUserModal(this.currentUser.id).then(user => {
                console.log(user);
            });
        };
    }
});