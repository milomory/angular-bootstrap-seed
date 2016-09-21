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
            user: () => ({id: 1, fullname: 'Test fullname'})
        }
    }).result;
});