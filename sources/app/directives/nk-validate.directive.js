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
        let $span = [];

        $scope.$watch(() => $input.val(), () => {
            if (Object.keys($scope.nkValidate.$error).length) {
                if (!$element.hasClass('has-error')) {
                    $element.removeClass('has-success').addClass('has-error');
                }

                // TODO починить
                if ($label && !$span.length) {
                    $span = $label.append('<span class="message"></span>').find('span.message');
                }

                switch (Object.keys($scope.nkValidate.$error)[0]) {
                    case 'required':
                        $span.html(` - ${$filter('translate')('Field is required')}`);
                        break;
                    case 'pattern':
                        $span.html(` - ${$filter('translate')('Field doesn\'t match pattern')} ${$input.attr('ng-pattern')}`);
                        break;
                }
            } else {
                if (!$element.hasClass('has-success')) {
                    $element.removeClass('has-error').addClass('has-success');
                }

                if ($label && $span.length) {
                    $span.remove();
                }
            }
        });
    }
}));