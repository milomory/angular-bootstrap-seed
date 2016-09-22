/**
 * Created by niko on 22.09.16.
 *
 * @ngdoc directive
 * @name nkFile
 * @restrict A
 */

angular.module('app').directive('nkFile', () => ({
    restrict: 'A',
    require: 'ngModel',
    link: function ($scope, $element, $attrs, ngModel) {
        $element.on('change', event => {
            let files = event.target.files;
            ngModel.$setViewValue($element.prop('multiple') ? files : files[0]);
            ngModel.$render();
        });

        $scope.$on('$destroy', () => $element.off('change'));
    }
}));