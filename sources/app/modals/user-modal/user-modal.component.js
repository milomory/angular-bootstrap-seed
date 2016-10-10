/**
 * Created by niko on 21.09.16.
 */

angular.module('app').component('userModal', {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./user-modal.component.html'),
    controller: function ($scope, $cookies) {
        $scope.$on('errorMessage', (event, message) => this.errorMessage = message);
        $scope.$on('loading', (event, loading) => this.loading = loading);

        this.currentUser = $cookies.getObject('currentUser');
        this.user = this.resolve.user;

        this.saveUser = () => {
            let user = angular.copy(this.user);
            user.$save().then(user => {
                this.close({$value: angular.extend(this.user, user)});
            }).finally(() => {
                delete this.user.localUser;
            });
        };

        this.removeUser = () => {
            let user = angular.copy(this.user);
            user.$remove().then(() => {
                this.close({$value: null});
            }).finally(() => {
                delete this.user.localUser;
            });
        };

        this.restoreUser = () => {
            let user = angular.copy(this.user);
            user.deletedAt = null;
            user.$save().then(user => {
                this.close({$value: angular.extend(this.user, user)});
            }).finally(() => {
                delete this.user.localUser;
            });
        };
    }
});