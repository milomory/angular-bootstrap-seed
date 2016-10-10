/**
 * Created by niko on 21.09.16.
 */

angular.module('app', [
    'ngAnimate', 'ngCookies', 'ngMessages', 'ngResource', 'ngSanitize',
    'ui.bootstrap', 'ui.router', 'ui.select',
    'pascalprecht.translate'
]).value('appConfig', {
    backendUrl: 'http://192.168.50.13:7000/',
    itemsPerPage: [20, 50]
}).config(($locationProvider, $urlRouterProvider, $translateProvider, $compileProvider) => {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/auth');

    $translateProvider.useSanitizeValueStrategy('')
        .translations('ru_RU', require('./translates/ru_RU.json'))
        .translations('ru_TJ', require('./translates/ru_TJ.json'));

    if (process.env.NODE_ENV == 'production') {
        $compileProvider.debugInfoEnabled(false);
    }
}).run(($cookies, $transitions, $state, $translate, authService) => {
    let currentUser = null;

    authService.check().catch(() => $state.go('auth'));

    $transitions.onBefore({}, () => currentUser = $cookies.getObject('currentUser'));

    $transitions.onStart({to: 'index.*'}, () => !!currentUser);
    $transitions.onError({to: 'index.*'}, () => $state.go('error'));

    $transitions.onStart({to: 'auth'}, () => !currentUser);
    $transitions.onError({to: 'auth'}, () => $state.go('index'));

    $transitions.onSuccess({}, () => document.body.scrollTop = document.documentElement.scrollTop = 0);

    $translate.use($cookies.getObject('currentLanguage') || navigator.languages[0]);
});

angular.element(document).ready(() => {
    requireAll(require.context('./components', true, /\.js$/));
    requireAll(require.context('./configs', true, /\.js$/));
    requireAll(require.context('./directives', true, /\.js$/));
    requireAll(require.context('./filters', true, /\.js$/));
    requireAll(require.context('./modals', true, /\.js$/));
    requireAll(require.context('./pages', true, /\.js$/));
    requireAll(require.context('./services', true, /\.js$/));
    require('./index.less');

    angular.bootstrap(document, ['app']);
});