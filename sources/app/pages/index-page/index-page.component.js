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
    controller: function ($scope, $cookies, $state, $translate, authService, modalService, socketService) {
        $scope.$on('loading', (event, loading) => this.loading = loading);

        this.currentUser = $cookies.getObject('currentUser');
        this.currentLanguage = $translate.proposedLanguage() || $translate.use();
        this.languages = $translate.getAvailableLanguageKeys();

        socketService.subscribe(`user${this.currentUser.id}`);

        socketService.on(`user${this.currentUser.id}`, `user${this.currentUser.id} update`, currentUser => {
            if (currentUser) {
                $cookies.putObject('currentUser', this.currentUser = currentUser);
                $scope.$applyAsync();
            }
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

        this.changeLanguage = function (language) {
            $translate.use(this.currentLanguage = language);
            $cookies.putObject('currentLanguage', language);
        };

        $scope.$on('$destroy', () => {
            socketService.unsubscribe(`user${this.currentUser.id}`);
        });
    }
});