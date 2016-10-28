angular.module('app').service('noticeService', function ($document, $timeout) {
    $document.find('body').append('<div class="notices"></div>');
    const $notices = $document.find('body').find('div.notices');

    this.danger = text => {
        $notices.append(`
            <div class="alert alert-danger">
                <button class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
                ${text}
            </div>
        `);
    };

    this.success = text => {
        $notices.append(`
            <div class="alert alert-success">
                <button class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
                ${text}
            </div>
        `);

        $timeout(() => {
            $notices.children('.alert-success').first().remove();
        }, 1000);
    };



//     const $notices = $document.find('body').append('<div class="notices">').find('div.notices');
//     const $alert = angular.element('<div class="alert"><button class="close" data-dismiss="alert"><i class="fa fa-close"></i></button></div>');
//
//     ['success', 'info', 'warning', 'danger'].forEach(type => {
//         this[type] = text => {
//             let t = angular.copy($alert);
//             t.addClass(`alert-${type}`);
//             t.html(text);
//             $notices.append(t);
// //             $notices.append(`
// //                 <div class="alert alert-${type}">
// // <button class="close" data-dismiss="alert">
// //         <i class="fa fa-close"></i>
// //     </button>
// // ${text}
// //                 </div>
// //             `);
//             $timeout(() => $notices.children().first().remove(), 2000);
//         };
//     });

    // this.danger = text => {
    //     dd.append(`<div class="alert alert-danger" >${text}</div>`);
    //     $timeout(() => {
    //         dd.children().first().remove();
    //     }, 2000);
    // };
});