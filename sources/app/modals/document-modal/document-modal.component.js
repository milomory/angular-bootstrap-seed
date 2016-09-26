/**
 * Created by niko on 21.09.16.
 */

angular.module('app').component('documentModal', {
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&'
    },
    template: require('./document-modal.component.html'),
    controller: function ($scope, $cookies, modalService) {
        $scope.$on('errorMessage', (event, message) => this.errorMessage = message);
        $scope.$on('loading', (event, loading) => this.loading = loading);

        $scope.$watch('$ctrl.document.file', () => {
            if (this.document.file) {
                this.document.name = this.document.file.name;
            }
        });

        this.currentUser = $cookies.getObject('currentUser');
        this.document = this.resolve.document;
        this.tags = this.resolve.tags;

        this.saveDocument = () => {
            let document = angular.copy(this.document);
            document.file = this.document.file;
            document.$save().then(document => {
                this.close({$value: angular.extend(this.document, document)});
            });
        };

        this.removeDocument = () => {
            let document = angular.copy(this.document);
            document.$remove().then(() => {
                this.close({$value: null});
            });
        };

        this.queryTags = params => {
            if (!params.name) return;

            this.tags.$query(params).then(tags => {
                this.tags = tags;
            });
        };

        this.showTagModal = tagId => {
            modalService.showTagModal(tagId).then(tag => {
                this.document.tags = this.document.tags || [];
                let index = this.document.tags.map(tag => tag.id).indexOf(tagId);

                if (!tag) { // tag has been removed
                    this.document.tags.splice(index, 1);
                } else if (index == -1) { // tag has been created
                    this.document.tags.push(tag);
                } else { // tag has beem updated
                    this.document.tags[index] = tag;
                }
            });
        };
    }
});