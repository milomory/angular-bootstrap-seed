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
    controller: function ($cookies, $state, appConfig, modalService) {
        this.currentUser = $cookies.getObject('currentUser');
        this.params = angular.copy($state.params);
        this.itemsPerPage = appConfig.itemsPerPage;

        if (this.params.tagIds) {
            this.params.tagIds = this.params.tagIds.split(',')
                .filter(tagId => !!parseInt(tagId)).unique().map(tagId => ({id: tagId}));
        } else {
            this.params.tagIds = [];
        }

        this.queryDocuments = params => {
            if (params) {
                angular.extend(this.params, params);

                if (params.tagIds) {
                    params.tagIds = params.tagIds
                        .map(tag => tag.id).filter(tagId => !!parseInt(tagId)).unique().join(',');
                }

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
            });
        };

        this.queryTags = params => {
            if (!params.name) return;

            this.tags.$query(params).then(tags => {
                this.tags = tags;
            });
        };
    }
});