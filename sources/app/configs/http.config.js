/**
 * Created by niko on 21.09.16.
 */

angular.module('app').config($httpProvider => {
    $httpProvider.defaults.withCredentials = true;
    $httpProvider.interceptors.push('httpInterceptor');
}).factory('httpInterceptor', ($rootScope, $filter, noticeService) => {
    let pending = 0;

    return {
        request: req => {
            $rootScope.$broadcast('loading', ++pending > 0);
            return req;
        },
        response: res => {
            $rootScope.$broadcast('loading', --pending > 0);

            if (res.config.method != 'GET') {
                noticeService.success($filter('translate')('Saved'));
            }

            return res;
        },
        responseError: res => {
            if (res.status == -1) {
                res.data = {message: $filter('translate')('Server is not available')};
            } else {
                res.data.message = res.data.message || $filter('translate')('Something wrong');
            }

            $rootScope.$broadcast('loading', --pending > 0);
            noticeService.danger(res.data.message);

            return Promise.reject(res);
        }
    };
});