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
        $rootScope.$on('loading', (event, loading) => this.loading = loading);

        this.currentUser = $cookies.getObject('currentUser');

        socketService.subscribe(`user${this.currentUser.id}`);
        socketService.on(`user${this.currentUser.id}`, `user${this.currentUser.id} update`, currentUser => {
            $cookies.putObject('currentUser', this.currentUser = currentUser);
            $rootScope.$applyAsync();
        });

        this.signout = () => {
            authService.signout().then(() => $state.go('auth'));
        };

        this.showUserModal = () => {
            modalService.showUserModal(this.currentUser.id).then(user => {
                $cookies.putObject('currentUser', this.currentUser = user);
                socketService.emit('users', 'users update');
            });
        };

        $rootScope.$on('$destroy', () => {
            socketService.unsubscribe(`user${this.currentUser.id}`);
        });
    }
});