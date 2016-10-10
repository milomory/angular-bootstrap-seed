/**
 * Created by niko on 10.10.16.
 */

angular.module('app').config($stateProvider => {
    $stateProvider.state({
        name: 'index.admin.users',
        url: '/users?page&limit&fullname&scopes',
        params: {
            page: {value: '1', squash: true},
            limit: {value: '10', squash: true},
            scopes: {value: 'documents', squash: true}
        },
        reloadOnSearch: false,
        component: 'usersPage',
        resolve: {
            users: ($stateParams, apiService) => {
                return apiService.User.query($stateParams).$promise;
            }
        }
    });
}).component('usersPage', {
    bindings: {
        users: '<'
    },
    template: require('./users-page.component.html'),
    controller: function ($scope, $cookies, $state, appConfig, modalService, socketService) {
        this.currentUser = $cookies.getObject('currentUser');
        this.params = angular.copy($state.params);
        this.itemsPerPage = appConfig.itemsPerPage;

        socketService.subscribe('users');
        socketService.on('users', 'users update', () => {
            this.queryUsers();
        });

        /**
         * @param {Object} [params]
         */
        this.queryUsers = params => {
            if (params) {
                Object.keys(params).forEach(key => {
                    $state.params[key] = this.params[key] = params[key];
                });

                console.groupCollapsed('params changed');
                console.log('this.params', this.params);
                console.log('$state.params', $state.params);
                console.log('params', params);
                console.groupEnd();
            }

            this.users.$query($state.params).then(users => {
                this.users = users;
                $state.go('.', $state.params);
            });
        };

        /**
         * @param {number} userId
         */
        this.showUserModal = userId => {
            modalService.showUserModal(userId).then(user => {
                this.queryUsers();

                socketService.emit(`user${userId}`, `user${userId} update`, user);
                socketService.emit('users', 'users update');
            });
        };

        $scope.$on('$destroy', () => {
            socketService.unsubscribe('users');
        });
    }
});