/**
 * Created by niko on 22.09.16.
 */

angular.module('app').config($stateProvider => {
    $stateProvider.state({
        name: 'index.documents',
        url: '/documents?page&limit&name&creatorId&scopes',
        params: {
            page: {value: '1', squash: true},
            limit: {value: '10', squash: true},
            scopes: {value: 'creator,tags', squash: true}
        },
        reloadOnSearch: false,
        component: 'documentsPage',
        resolve: {
            documents: ($stateParams, apiService) => apiService.Document.query($stateParams).$promise,
            users: apiService => apiService.User.query().$promise
        }
    });
}).component('documentsPage', {
    bindings: {
        documents: '<',
        users: '<'
    },
    template: require('./documents-page.component.html'),
    controller: function ($cookies, $state, appConfig, modalService) {
        this.currentUser = $cookies.getObject('currentUser');
        this.params = $state.params;
        this.itemsPerPage = appConfig.itemsPerPage;

        this.queryDocuments = params => {
            angular.extend(this.params, params);
            this.documents.$query(this.params).then(documents => {
                this.documents = documents;
                $state.go('.', this.params);
            });
        };

        this.showDocumentModal = documentId => {
            modalService.showDocumentModal(documentId).then(document => {
                this.queryDocuments();
            });
        };
    }
});