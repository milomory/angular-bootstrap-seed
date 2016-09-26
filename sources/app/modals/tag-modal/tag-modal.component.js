/**
 * Created by niko on 22.09.16.
 */

angular.module('app').component('tagModal', {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./tag-modal.component.html'),
    controller: function ($scope, $cookies) {
        $scope.$on('errorMessage', (event, message) => this.errorMessage = message);
        $scope.$on('loading', (event, loading) => this.loading = loading);

        this.currentUser = $cookies.getObject('currentUser');
        this.tag = this.resolve.tag;

        this.saveTag = () => {
            let tag = angular.copy(this.tag);
            tag.$save().then(tag => {
                this.close({$value: angular.extend(this.tag, tag)});
            });
        };

        this.removeTag = () => {
            let tag = angular.copy(this.tag);
            tag.$remove().then(() => {
                this.close({$value: null});
            });
        };
    }
});