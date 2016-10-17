/**
 * Created by niko on 17.10.16.
 *
 * TODO переименовать ВСЁ!!!
 */

angular.module('app').service('paramService', function () {
    this.validate = stateParams => {
        // преобразователь stateParams которые имеют ids в строку уникальных number
        Object.keys(stateParams).filter(key => /ids$/i.test(key) && stateParams[key]).reduce((params, key) =>
            Object.assign(params, {
                [key]: stateParams[key].split(',').map(compose(Math.abs, Math.trunc)).filter(Boolean).unique()
                    .join(',') || undefined
            }), stateParams
        );

        return stateParams;
    };

    // преобразователь всех thisParams, которые имеют ids, в массивы объектов с id
    this.convertToArray = (params, regex = /ids/i) => {
        Object.keys(params).filter(key => regex.test(key)).forEach(key => {
            params[key] = (params[key] || '').split(',').map(compose(Math.abs, Math.trunc)).filter(Boolean).unique()
                .map(id => ({id}));
        });

        return params;
    };

    this.mergeUniqueIds = (target, source) => {
        Object.keys(target).forEach(key => {
            if (Array.isArray(target[key]) && /ids$/i.test(key)) {
                target[key] = target[key].concat(source[key]).reduce((param, item) =>
                    Object.assign(param, {[item.id]: Object.assign(param[item.id] || {}, item)}), {}
                );

                target[key] = Object.keys(target[key]).map(id => target[key][id]);
            }
        });

        return target;
    };

    this.mergeParams1 = (params, stateParams, thisParams) => {
        Object.keys(params).forEach(key => {
            // stateParams[key] = params[key];

            if (Array.isArray(params[key]) && /ids$/i.test(key)) {
                // скресщиватель всех params которые array с thisParams
                params[key] = thisParams[key].concat(params[key]).reduce((param, item) =>
                    Object.assign(param, {[item.id]: Object.assign(param[item.id] || {}, item)}), {}
                );

                params[key] = Object.keys(params[key]).map(id => params[key][id]);
                // stateParams[key] = params[key].map(item => item.id).join(',') || undefined;
            }

            thisParams[key] = params[key];
        });

        console.groupCollapsed('params changed');
        console.log('this.params', thisParams);
        console.log('$state.params', stateParams);
        console.log('params', params);
        console.groupEnd();

        return [thisParams, stateParams];
    };
});