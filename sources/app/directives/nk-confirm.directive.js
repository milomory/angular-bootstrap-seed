/**
 * Created by niko on 21.09.16.
 *
 * @ngdoc directive
 * @name nkConfirm
 * @restrict A
 */

angular.module('app').directive('nkConfirm', ($document, $uibModal, $filter) => ({
    restrict: 'A',
    scope: {
        nkConfirm: '@',
        ngClick: '&'
    },
    link: function ($scope, $element) {
        $element.on('click', event => {
            $scope.nkConfirm = $scope.nkConfirm || $filter('translate')('Confirm action');
            $uibModal.open({
                size: 'sm',
                scope: $scope,
                appendTo: $document.find('div').eq(0),
                template: `
                    <div class="modal-body">{{::nkConfirm}}</div>
                    <div class="modal-footer">
                        <button class="btn btn-default" ng-click="$dismiss('cancel')">{{'Cancel' | translate}}</button>
                        <button class="btn btn-primary" ng-click="$close();ngClick()">{{'Ok' | translate}}</button>
                    </div>
                `
            });

            event.stopImmediatePropagation();
        });

        $scope.$on('$destroy', () => $element.off('click'));
    }
}));