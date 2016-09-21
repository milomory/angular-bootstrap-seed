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
            user.$save().then(user => angular.extend(user, this.user));
        };

        this.removeUser = () => {
            let user = angular.copy(this.user);
            user.$remove().then(user => angular.extend(user, this.user));
        };

        this.restoreUser = () => {
            let user = angular.copy(this.user);
            user.deletedAt = null;
            user.$save().then(user => angular.extend(user, this.user));
        };
    }
});