/**
 * Created by niko on 21.09.16.
 */

angular.module('app', [
]).config(($locationProvider, $compileProvider) => {
    $locationProvider.html5Mode(true).hashPrefix('!');

    if (process.env.NODE_ENV == 'production') {
        $compileProvider.debugInfoEnabled(false);
    }
});

angular.element(document).ready(() => {
    angular.bootstrap(document, ['app']);
});