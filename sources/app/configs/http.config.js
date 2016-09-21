/**
 * Created by niko on 21.09.16.
 */

angular.module('app').config($httpProvider => {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('httpInterceptor');
}).factory('httpInterceptor', ($rootScope) => {
    let pending = 0;

    return {
        request: req => {
            $rootScope.$broadcast('loading', ++pending > 0);
            return req;
        },
        response: res => {
            $rootScope.$broadcast('loading', --pending > 0);
            return res;
        },
        responseError: res => {
            $rootScope.$broadcast('loading', --pending > 0);

            if (res.status == -1) {
                res.data = {message: 'Сервер временно недоступен'};
            } else {
                res.data.message = res.data.message || 'Что-то пошло не так';
            }

            $rootScope.$broadcast('errorMessage', res.data.message);

            return Promise.reject(res);
        }
    };
});