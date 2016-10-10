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
    controller: function ($rootScope, $cookies, $state, authService, modalService, socketService) {
        $rootScope.$on('errorMessage', (event, message) => this.errorMessage = message);
        $rootScope.$on('currentUser', (event, currentUser) => this.currentUser = currentUser);
        $rootScope.$on('loading', (event, loading) => this.loading = loading);

        this.currentUser = $cookies.getObject('currentUser');

        this.signout = () => {
            authService.signout().then(() => $state.go('auth'));
        };

        this.showUserModal = () => {
            modalService.showUserModal(this.currentUser.id).then(user => {
                $cookies.putObject('currentUser', this.currentUser = user);
                socketService.emit('users', 'users update');
            });
        };
    }
});