/**
 * Created by niko on 22.09.16.
 */

angular.module('app').config($stateProvider => {
    $stateProvider.state({
        name: 'index.documents',
        url: '/documents?page&limit&name&creatorId&tagIds&scopes',
        params: {
            page: {value: '1', squash: true},
            limit: {value: '10', squash: true},
            scopes: {value: 'creator,tags', squash: true}
        },
        reloadOnSearch: false,
        component: 'documentsPage',
        resolve: {
            documents: ($stateParams, apiService) => {
                // преобразователь $stateParams которые имеют ids в строку уникальных number
                Object.keys($stateParams).filter(key => /ids/i.test(key) && $stateParams[key]).reduce((params, key) => {
                    params[key] = $stateParams[key].split(',').map(Number).filter(Boolean).unique().join(',');
                    return params;
                }, $stateParams);

                return apiService.Document.query($stateParams).$promise;
            },
            users: ($stateParams, apiService) => {
                return apiService.User.query().$promise;
            },
            tags: ($stateParams, apiService) => {
                if ($stateParams.tagIds) {
                    // преобразователь $stateParams.tagIds в массив с уникальными number
                    $stateParams.tagIds = $stateParams.tagIds.split(',').map(Number).filter(Boolean).unique();

                    if ($stateParams.tagIds.length) {
                        $stateParams.tagIds = $stateParams.tagIds.join(',');
                        return apiService.Tag.query({ids: $stateParams.tagIds}).$promise;
                    }
                }

                return new apiService.Tag();
            }
        }
    });
}).component('documentsPage', {
    bindings: {
        documents: '<',
        users: '<',
        tags: '<'
    },
    template: require('./documents-page.component.html'),
    controller: function ($scope, $cookies, $state, appConfig, modalService, socketService) {
        this.currentUser = $cookies.getObject('currentUser');
        this.params = angular.copy($state.params);
        this.itemsPerPage = appConfig.itemsPerPage;

        // преобразователь всех this.params, которые имеют ids, в массивы объектов с id
        Object.keys(this.params).filter(key => /ids/i.test(key)).forEach(key => {
            this.params[key] = (this.params[key] || '').split(',').map(Number).filter(Boolean).unique().map(id => ({id}));
        });

        socketService.subscribe('documents');
        socketService.on('documents', 'documents update', () => {
            this.queryDocuments();
            this.queryTags({ids: $state.params.tagIds});
        });

        /**
         * @param {Object} [params]
         * @param {string} [params.creatorId]
         * @param {string} [params.tagIds]
         */
        this.queryDocuments = params => {
            if (params) {
                // ВНИМАНИЕ! немного выебонов (TODO оптимизировать еще немного)
                // TODO в этом месте недостаточно выебонов. Может, стоит добавить еще [больше](http://lurkmore.to) ?
                Object.keys(params).forEach(key => {
                    if (Array.isArray(params[key]) && /ids$/i.test(key)) {
                        // скресщиватель всех params которые array с this.params
                        params[key] = this.params[key].concat(params[key]).reduce((param, item) =>
                            Object.assign(param, {[item.id]: Object.assign(param[item.id] || {}, item)}), {}
                        );

                        params[key] = Object.keys(params[key]).map(id => params[key][id]);
                        $state.params[key] = params[key].map(item => item.id).join(',') || undefined;
                    } else {
                        $state.params[key] = params[key];
                    }

                    this.params[key] = params[key];
                });

                console.groupCollapsed('params changed');
                console.log('this.params', this.params);
                console.log('$state.params', $state.params);
                console.log('params', params);
                console.groupEnd();

                this.documents.$query($state.params).then(documents => {
                    this.documents = documents;
                    $state.go('.', $state.params);
                });
            }
        };

        /**
         * @param {number} documentId
         */
        this.showDocumentModal = documentId => {
            modalService.showDocumentModal(documentId).then(document => {
                this.queryDocuments();
                this.queryTags({ids: $state.params.tagIds});

                socketService.emit('documents', 'documents update');
            });
        };

        /**
         * @param {Object} [params]
         * @param {string} [params.name]
         * @param {string} [params.ids]
         */
        this.queryTags = params => {
            if (params.name || params.ids) {
                this.tags.$query(params).then(tags => {
                    this.tags = tags;
                });
            }
        };

        $scope.$on('$destroy', () => {
            socketService.unsubscribe('documents');
        });
    }
});