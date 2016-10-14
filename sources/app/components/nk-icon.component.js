/**
 * Created by niko on 14.10.16.
 *
 * @ngdoc component
 * @name nkIcon
 *
 * @param {string} name
 */

angular.module('app').component('nkIcon', {
    bindings: {
        name: '@'
        /*ngModel: '<',
        has: '@',
        name: '@'*/
    },
    template: '<span class="fa" ng-class="$ctrl.className" aria-hidden="true"></span>',
    controller: function () {
        this.$onChanges = changes => {
            if (changes.name.currentValue) {
                this.className = 'fa-' + changes.name.currentValue;
            }
        };

        /*this.$onChanges = () => {
            switch (this.name) {
                case 'sort':
                    this.iconClass = 'fa-sort';

                    if (this.ngModel.indexOf(this.has) != -1) {
                        this.iconClass += '-' + (this.ngModel == this.has ? 'up' : 'down');
                    }
                    break;
                case 'updown':
                    this.iconClass = 'fa-arrow-' + (this.ngModel ? 'up' : 'down');
                    break;
            }
        };*/
    }
});