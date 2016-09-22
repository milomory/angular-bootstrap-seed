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
                return angular.extend(data, {bornAt: new Date(data.bornAt)});
            }
        },
        update: {
            method: 'PUT',
            transformResponse: data => {
                data = angular.fromJson(data);
                return angular.extend(data, {bornAt: new Date(data.bornAt)});
            }
        }
    });

    /**
     * @name apiService#Document
     */
    this.Document = $resource(`${appConfig.backendUrl}api/documents/:id`, {id: '@id'}, {
        get: {
            method: 'GET',
            transformResponse: data => {
                data = angular.fromJson(data);
                return angular.extend(data, {url: appConfig.backendUrl + data.url});
            }
        },
        query: {
            method: 'GET',
            transformResponse: data => {
                data = angular.fromJson(data);

                if (data && data.rows) {
                    data.rows = data.rows.map(item => angular.extend(item, {url: appConfig.backendUrl + item.url}));
                }

                return data;
            }
        },
        create: {
            method: 'POST',
            headers: {'Content-Type': undefined},
            transformRequest: data => {
                let formData = new FormData();

                if (data.file) {
                    formData.append('file', data.file);
                    data.file = null;
                }

                formData.append('data', angular.toJson(data));

                return formData;
            }
        },
        update: {
            method: 'PUT',
            headers: {'Content-Type': undefined},
            transformRequest: data => {
                let formData = new FormData();

                if (data.file) {
                    formData.append('file', data.file);
                    data.file = null;
                }

                formData.append('data', angular.toJson(data));

                return formData;
            }
        }
    });

    /**
     * @name apiService#Tag
     */
    this.Tag = $resource(`${appConfig.backendUrl}api/tags/:id`, {id: '@id'});
});