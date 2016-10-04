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
                let params = $stateParams;
                // преобразователь всех $stateParams, которые имеют ids, в строчки с уникальными number
                Object.keys(params).filter(key => /ids/i.test(key) && params[key]).forEach(key => {
                    params[key] = params[key].split(',').map(id => parseInt(id)).filter(id => !Number.isNaN(id))
                        .unique().join(',');
                });

                return apiService.Document.query($stateParams).$promise;
            },
            users: ($stateParams, apiService) => {
                return apiService.User.query().$promise;
            },
            tags: ($stateParams, apiService) => {
                if ($stateParams.tagIds) {
                    // преобразователь $stateParams.tagIds в массив с уникальными number
                    $stateParams.tagIds = $stateParams.tagIds.split(',').map(id => parseInt(id))
                        .filter(id => !Number.isNaN(id)).unique();

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
            this.params[key] = this.params[key] ? this.params[key].split(',').map(id => ({id: parseInt(id)})) : [];
        });

        socketService.subscribe('documents');
        socketService.on('documents', 'documents update', () => {
            this.queryDocuments();
            this.queryTags();
        });

        this.queryDocuments = params => {
            if (params) {
                Object.keys(params).filter(key => Array.isArray(params[key])).forEach(key => {
                    let ids = this.params[key].map(item => item.id);
                    ids = ids.concat(params[key].map(item => item.id).filter(id => ids.indexOf(id) == -1));
                    // let paramIds = this.params[key].map(item => item.id);
                    // let ids = params[key].filter(item => paramIds.indexOf(item.id) == -1).map(item => parseInt(item.id))
                    // ids = ids.concat();
                });

                // Object.keys(params).filter(key => Array.isArray(params[key])).forEach(key => {
                //     let ids = this.params[key].map(item => parseInt(item.id));
                //
                //     params[key].filter(item => ids.indexOf(item.id) == -1).forEach(item => {
                //         // костыль для обновления связанного массива
                //         let index = key.toLowerCase().indexOf('id');
                //         this[key.substr(0, index) + 's'].rows.push(item);
                //
                //         ids.push(parseInt(item.id));
                //     });
                //
                //     params[key] = ids.map(id => ({id})).unique();
                // });
                //
                // angular.extend(this.params, params);
                //
                // Object.keys(params).filter(key => Array.isArray(params[key])).forEach(key => {
                //     params[key] = params[key].join(',');
                // });

                // angular.extend($state.params, params);

                // this.documents.$query($state.params).then(documents => {
                //     this.documents = documents;
                //     $state.go('.', $state.params);
                // });
            }
        };

        this.showDocumentModal = documentId => {
            modalService.showDocumentModal(documentId).then(document => {
                this.queryDocuments();
                this.queryTags();

                socketService.emit('documents', 'documents update');
            });
        };

        this.queryTags = params => {
            if (params.name || params.ids) {
                // обработка массива ids
                Object.keys(params).filter(key => angular.isArray(params[key])).forEach(key => {
                    params[key] = params[key].extractKeyFromEachObject('id').join(',');
                });

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