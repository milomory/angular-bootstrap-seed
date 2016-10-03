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
                if ($stateParams.tagIds) {
                    // уникальные id которые int > 0
                    $stateParams.tagIds = $stateParams.tagIds.split(',')
                        .filter(tagId => !!parseInt(tagId)).unique().join(',');
                }

                return apiService.Document.query($stateParams).$promise;
            },
            users: ($stateParams, apiService) => {
                return apiService.User.query().$promise;
            },
            tags: ($stateParams, apiService) => {
                if ($stateParams.tagIds) {
                    // уникальные id которые int > 0
                    $stateParams.tagIds = $stateParams.tagIds.split(',')
                        .filter(tagId => !!parseInt(tagId)).unique().join(',');

                    return apiService.Tag.query({ids: $stateParams.tagIds}).$promise;
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

        socketService.subscribe('documents');
        socketService.on('documents', 'documents update', () => {
            this.queryDocuments();
            this.queryTags();
        });

        if (this.params.tagIds) {
            this.params.tagIds = this.params.tagIds.split(',')
                .filter(tagId => !!parseInt(tagId)).unique().map(tagId => ({id: tagId}));
        } else {
            this.params.tagIds = [];
        }

        this.queryDocuments = params => {
            if (params) {
                Object.keys(params).filter(key => angular.isArray(params[key])).forEach(key => {
                    let items = this.params[key].map(item => item.id);
                    params[key].filter(item => items.indexOf(item.id) == -1).forEach(item => items.push(item.id));
                    params[key] = items.map(item => ({id: item})).unique();
                    // TODO update select
                });

                angular.extend(this.params, params);

                // обработка массива ids
                Object.keys(params).filter(key => angular.isArray(params[key])).forEach(key => {
                    params[key] = params[key].map(item => item.id).filter(id => !!parseInt(id)).unique().join(',');
                });

                angular.extend($state.params, params);
            }

            this.documents.$query($state.params).then(documents => {
                this.documents = documents;
                $state.go('.', $state.params);
            });
        };

        this.showDocumentModal = documentId => {
            modalService.showDocumentModal(documentId).then(document => {
                this.queryDocuments();
                this.queryTags();

                socketService.emit('documents', 'documents update');
            });
        };

        this.queryTags = params => {
            if (!params.name) return;

            this.tags.$query(params).then(tags => {
                this.tags = tags;
            });
        };

        $scope.$on('$destroy', () => {
            socketService.unsubscribe('documents');
        });
    }
});