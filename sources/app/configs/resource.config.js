/**
 * Created by niko on 21.09.16.
 */

angular.module('app').config($resourceProvider => {
    angular.extend($resourceProvider.defaults.actions, {
        query: {method: 'GET'}, create: {method: 'POST'}, update: {method: 'PUT'}
    });
}).decorator('$resource', $delegate => function () {
    const $resource = $delegate.apply(this, arguments);
    $resource.prototype.$save = function () {
        return this[this.id ? '$update' : '$create'].apply(this, arguments);
    };
    return $resource;
});