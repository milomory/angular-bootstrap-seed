/**
 * Created by niko on 01.10.16.
 */

angular.module('app').service('noticeService', function ($document, $timeout) {
    $document.find('body').append('<div class="notices"></div>');
    const $notices = $document.find('body').find('div.notices');

    /**
     * @name noticeService#danger
     * @param {string} text
     */

    /**
     * @name noticeService#success
     * @param {string} text
     */

    ['danger', 'success'].forEach(type => {
        this[type] = text => {
            $notices.append(`
                <div class="alert alert-${type} animated slideInRight">
                    <button class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
                    ${text}
                </div>
            `);

            $timeout(() => {
                let $alert = $notices.children(`.alert-${type}`).first();
                $alert.animateCss('slideOutRight', () => $alert.remove());
            }, 2000);
        };
    });
});