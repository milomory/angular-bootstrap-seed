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

            switch (res.config.method) {
                case 'POST':
                    noticeService.success($filter('translate')('Created'));
                    break;
                case 'PUT':
                    noticeService.success($filter('translate')('Updated'));
                    break;
                case 'DELETE':
                    noticeService.success($filter('translate')('Deleted'));
                    break;
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