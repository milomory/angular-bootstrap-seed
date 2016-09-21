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
    controller: function ($scope) {
        $scope.$on('errorMessage', (event, message) => this.errorMessage = message);
        $scope.$on('loading', (event, loading) => this.loading = loading);

        this.user = this.resolve.user;
    }
});