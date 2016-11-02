/**
 * Created by niko on 21.09.16.
 */

angular.module('app', [
    'ngAnimate', 'ngCookies', 'ngMessages', 'ngResource', 'ngSanitize',
    'ui.bootstrap', 'ui.router', 'ui.select', 'ui.mask',
    'pascalprecht.translate'
]).value('appConfig', {
    backendUrl: `http://${process.env.HOST}:7000/`,
    itemsPerPage: [20, 50]
}).config(($locationProvider, $urlRouterProvider, $translateProvider, $compileProvider) => {
    $locationProvider.html5Mode(true).hashPrefix('!');
    $urlRouterProvider.otherwise('/auth');
    $translateProvider.useSanitizeValueStrategy('');

    let languageContext = require.context('./translates', true, /\.json$/);
    let languages = ['en_US'];

    languageContext.keys().forEach(filename => {
        let language = filename.match(/\w+/)[0];
        $translateProvider.translations([languages.push(language), language][1], languageContext(filename));
    });

    $translateProvider.registerAvailableLanguageKeys(languages);

    if (process.env.NODE_ENV == 'production') {
        $compileProvider.debugInfoEnabled(false);
    }

}).run(($cookies, $transitions, $state, $translate, authService) => {
    let currentUser = null;

    authService.check().catch(() => $state.go('auth'));

    $transitions.onBefore({}, () => currentUser = $cookies.getObject('currentUser'));

    $transitions.onStart({to: 'index.*'}, () => !!currentUser);
    $transitions.onError({to: 'index.*'}, () => $state.go('auth'));

    // TODO рекурсивность
    // $transitions.onStart({to: 'index'}, () => false);
    // $transitions.onError({to: 'index'}, () => $state.go('index.documents'));

    $transitions.onStart({to: 'index.admin.*'}, () => currentUser ? currentUser.isAdmin : false);
    $transitions.onError({to: 'index.admin.*'}, () => $state.go('index'));

    $transitions.onStart({to: 'auth'}, () => !currentUser);
    $transitions.onError({to: 'auth'}, () => $state.go('index'));

    $transitions.onSuccess({}, () => document.body.scrollTop = document.documentElement.scrollTop = 0);

    $translate.use($cookies.getObject('currentLanguage') || 'en_US');
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

// TODO create toastr