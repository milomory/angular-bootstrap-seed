/**
 * Created by niko on 10.10.16.
 */

angular.module('app').config($stateProvider => {
    $stateProvider.state({
        name: 'index.admin.tags',
        url: '/tags?page&limit&name&scopes',
        params: {
            page: {value: '1', squash: true},
            limit: {value: '10', squash: true},
            scopes: {value: 'documents', squash: true}
        },
        reloadOnSearch: false,
        component: 'tagsPage',
        resolve: {
            tags: ($stateParams, apiService) => {
                return apiService.Tag.query($stateParams).$promise;
            }
        }
    });
}).component('tagsPage', {
    bindings: {
        tags: '<'
    },
    template: require('./tags-page.component.html'),
    controller: function ($scope, $cookies, $state, appConfig, modalService, socketService) {
        this.currentUser = $cookies.getObject('currentUser');
        this.params = angular.copy($state.params);
        this.itemsPerPage = appConfig.itemsPerPage;

        socketService.subscribe('tags');
        socketService.on('tags', 'tags update', () => {
            this.queryTags();
        });

        /**
         * @param {Object} [params]
         */
        this.queryTags = params => {
            if (params) {
                Object.keys(params).forEach(key => {
                    $state.params[key] = this.params[key] = params[key];
                });

                console.groupCollapsed('params changed');
                console.log('this.params', this.params);
                console.log('$state.params', $state.params);
                console.log('params', params);
                console.groupEnd();
            }

            this.tags.$query($state.params).then(tags => {
                this.tags = tags;
                $state.go('.', $state.params);
            });
        };

        /**
         * @param {number} tagId
         */
        this.showTagModal = tagId => {
            modalService.showTagModal(tagId).then(tag => {
                this.queryTags();

                socketService.emit('tags', 'tags update');
            });
        };

        $scope.$on('$destroy', () => {
            socketService.unsubscribe('tags');
        });
    }
});