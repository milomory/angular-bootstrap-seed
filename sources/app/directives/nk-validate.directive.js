/**
 * Created by niko on 27.10.16.
 *
 * @ngdoc directiive
 * @name nkValidate
 * @restrict A
 */

angular.module('app').directive('nkValidate', $filter => ({
    restrict: 'A',
    scope: {
        nkValidate: '='
    },
    link: function ($scope, $element, $attrs) {
        let $label = $element.find('label.control-label');
        let $input = $element.find('input.form-control');
        let $small = [];

        $scope.$watch(() => $input.val(), () => {
            if (Object.keys($scope.nkValidate.$error).length) {
                if (!$element.hasClass('has-error')) {
                    $element.removeClass('has-success').addClass('has-error');
                }

                if ($label && !$small.length) {
                    $small = $label.append('<small class="message"></small>').find('small.message');
                }

                switch (Object.keys($scope.nkValidate.$error)[0]) {
                    case 'required':
                        $small.html(` - ${$filter('translate')('Field is required')}`);
                        break;
                    case 'pattern':
                        $small.html(` - ${$filter('translate')('Field doesn\'t match pattern')} ${$input.attr('ng-pattern')}`);
                        break;
                    case 'mask':
                        $small.html(` - ${$filter('translate')('Field doesn\'t match mask')} ${$input.attr('ui-mask')}`);
                        break;
                }
            } else {
                if (!$element.hasClass('has-success')) {
                    $element.removeClass('has-error').addClass('has-success');
                }

                if ($label && $small.length) {
                    $small.remove();
                    $small = [];
                }
            }
        });
    }
}));