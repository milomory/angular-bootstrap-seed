/**
 * Created by niko on 21.09.16.
 */

angular.module('app').service('modalService', function ($document, $uibModal) {
    /**
     * @name modalService#showUserModal
     * @param userId
     * @return Promise
     */
    this.showUserModal = userId => $uibModal.open({
        component: 'userModal',
        appendTo: $document.find('div').eq(0),
        resolve: {
            user: apiService => {
                if (userId == 0) {
                    return new apiService.User();
                }

                return apiService.User.get({id: userId}).$promise;
            }
        }
    }).result;

    /**
     * @name modalService#showDocumentModal
     * @param documentId
     * @return Promise
     */
    this.showDocumentModal = documentId => $uibModal.open({
        component: 'documentModal',
        appendTo: $document.find('div').eq(0),
        resolve: {
            document: apiService => {
                if (documentId == 0) {
                    return new apiService.Document({isPrivate: true});
                }

                return apiService.Document.get({id: documentId}).$promise;
            },
            tags: apiService => apiService.Tag.query().$promise
        }
    }).result;

    /**
     * @name modalService#showTagModal
     * @param tagId
     * @return Promise
     */
    this.showTagModal = tagId => $uibModal.open({
        component: 'tagModal',
        appendTo: $document.find('div').eq(0),
        resolve: {
            tag: apiService => {
                if (tagId == 0) {
                    return new apiService.Tag();
                }

                return apiService.Tag.get({id: tagId}).$promise;
            }
        }
    }).result;
});