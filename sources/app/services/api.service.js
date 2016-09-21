/**
 * Created by niko on 21.09.16.
 */

angular.module('app').service('apiService', function ($resource, appConfig) {
    /**
     * @name apiService#User
     */
    this.User = $resource(`${appConfig.backendUrl}api/users/:id`, {id: '@id'}, {
        get: {
            method: 'GET',
            transformResponse: data => {
                data = angular.fromJson(data);
                data.bornAt = new Date(data.bornAt);
                return data;
            }
        },
        update: {
            method: 'PUT',
            transformResponse: data => {
                data = angular.fromJson(data);
                data.bornAt = new Date(data.bornAt);
                return data;
            }
        }
    });
});