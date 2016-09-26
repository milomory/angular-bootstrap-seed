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
            documents: ($stateParams, apiService) => apiService.Document.query($stateParams).$promise,
            users: apiService => apiService.User.query().$promise,
            tags: apiService => apiService.Tag.query().$promise
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
        this.params.tagIds = this.params.tagIds.split(',').map(tagId => ({id: tagId}));
        this.itemsPerPage = appConfig.itemsPerPage;

        this.queryDocuments = params => {
            if (params.hasOwnProperty('tagIds')) {
                params.tagIds = params.tagIds.map(tag => tag.id).join(',');
            }

            angular.extend($state.params, params);

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