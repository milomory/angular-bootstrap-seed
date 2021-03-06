/**
 * Created by niko on 21.09.16.
 */

angular.module('app').service('authService', function ($http, $cookies, appConfig) {
    /**
     * @name authService#check
     * @return {Promise}
     */
    this.check = () => $http.get(`${appConfig.backendUrl}check`)
        .then(res => [res.data, $cookies.putObject('currentUser', res.data)][0])
        .catch(res => [Promise.reject(res.data), $cookies.remove('currentUser')][0]);

    /**
     * @name authService#signin
     * @param {Object} user
     * @param {string} user.username
     * @param {string} user.password
     * @return {Promise}
     */
    this.signin = user => $http.post(`${appConfig.backendUrl}signin`, user)
        .then(res => [res.data, $cookies.putObject('currentUser', res.data)][0])
        .catch(res => [Promise.reject(res.data), $cookies.remove('currentUser')][0]);

    /**
     * @name authService#signup
     * @param {Object} user
     * @param {string} user.username
     * @param {string} user.password
     * @return {Promise}
     */
    this.signup = user => $http.post(`${appConfig.backendUrl}signup`, user)
        .then(res => [res.data, $cookies.putObject('currentUser', res.data)][0])
        .catch(res => [Promise.reject(res.data), $cookies.remove('currentUser')][0]);

    /**
     * @name authService#signout
     * @return {Promise}
     */
    this.signout = () => $http.delete(`${appConfig.backendUrl}signout`)
        .then(res => [res.data, $cookies.remove('currentUser')][0])
        .catch(res => [Promise.reject(res.data), $cookies.remove('currentUser')][0]);
});