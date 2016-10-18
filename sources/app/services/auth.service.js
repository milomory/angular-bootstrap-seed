/**
 * Created by niko on 21.09.16.
 */

angular.module('app').service('authService', function ($http, $cookies, appConfig) {
    /**
     * @name authService#check
     * @return {Promise}
     */
    this.check = () => $http.get(`${appConfig.backendUrl}check`).then(res => {
        $cookies.putObject('currentUser', res.data);
        return res.data;
    }, res => {
        $cookies.remove('currentUser');
        return Promise.reject(res);
    });

    /**
     * @name authService#signin
     * @param {Object} user
     * @param {string} user.username
     * @param {string} user.password
     * @return {Promise}
     */
    this.signin = user => $http.post(`${appConfig.backendUrl}signin`, user).then(res => {
        $cookies.putObject('currentUser', res.data);
        return res.data;
    }, res => {
        $cookies.remove('currentUser');
        return Promise.reject(res);
    });

    /**
     * @name authService#signup
     * @param {Object} user
     * @param {string} user.username
     * @param {string} user.password
     * @return {Promise}
     */
    this.signup = user => $http.post(`${appConfig.backendUrl}signup`, user).then(res => {
        $cookies.putObject('currentUser', res.data);
        return res.data;
    }, res => {
        $cookies.remove('currentUser');
        return Promise.reject(res);
    });

    /**
     * @name authService#signout
     * @return {Promise}
     */
    this.signout = () => $http.delete(`${appConfig.backendUrl}signout`).then(res => {
        $cookies.remove('currentUser');
        return res.data;
    }, res => {
        $cookies.remove('currentUser');
        return Promise.reject(res);
    });
});