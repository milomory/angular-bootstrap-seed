/**
 * Created by niko on 22.09.16.
 *
 * @ngdoc directiive
 * @name nkPreview
 * @restrict A
 */

angular.module('app').directive('nkPreview', ($document, $uibModal) => ({
    restrict: 'A',
    scope: {
        nkPreview: '@'
    },
    link: function ($scope, $element) {
        $element.on('click', event => {
            $scope.hash = Math.random();
            $uibModal.open({
                size: 'lg',
                scope: $scope,
                appendTo: $document.find('div').eq(0),
                template: `<img ng-src="{{::nkPreview + '?hash=' + hash}}" class="img-responsive img-rounded">`
            });
        });

        $scope.$on('$destroy', () => $element.off('click'));
    }
}));