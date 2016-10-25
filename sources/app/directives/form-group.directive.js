/**
 * Created by niko on 25.10.16.
 */

angular.module('app').directive('formGroup', () => ({
    restrict: 'C',
    link: function ($scope, $element) {
        let $input = $element.find('input');
        if (!$input) return;

        $input.on('change keydown keyup click', event => {
            if ($input.hasClass('ng-invalid')) {
                if ($element.hasClass('has-success') && !$element.hasClass('has-error')) {
                    $element.removeClass('has-success').addClass('has-error');
                }
            } else {
                if ($element.hasClass('has-error') && !$element.hasClass('has-success')) {
                    $element.removeClass('has-error').addClass('has-success');
                }
            }

            // if ($input.hasClass('ng-invalid') && !$element.hasClass('has-error')) {
            //     if ($element.hasClass('has-success')) {
            //         $element.removeClass('has-success');
            //     }
            //
            //     $element.addClass('has-error');
            // }
            //
            // if ($input.hasClass('ng-valid') && !$element.hasClass('has-success')) {
            //     if ($element.hasClass('has-error')) {
            //         $element.removeClass('has-error');
            //     }
            //
            //     $element.addClass('has-success');
            // }
        });

        $scope.$on('$destroy', () => $input.off('change keydown keyup click'));

        // if ($input) {
        //
        //
        //     console.log($input.hasClass('ng-pristine'));
        //     $input.on('change keyup', event => {
        //         if ($input.hasClass('ng-invalid')) {
        //             $element.addClass('has-error');
        //         } else {
        //             $element.removeClass('has-error');
        //         }
        //     });
        //
        //     $scope.$on('$destroy', () => $input.off('change keyup'));
        // }
    }
}));