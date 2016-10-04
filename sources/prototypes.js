/**
 * Created by niko on 04.10.16.
 */

/**
 * @return {Array}
 */
Array.prototype.unique = function () {
    return this.filter((item, i, arr) => arr.indexOf(item) == i);
};

/**
 * @return {boolean}
 */
Number.prototype.isNaN = function () {
    return this.toString() == 'NaN';
};

// Number.prototype.isInteger = Number.isInteger || function(value) {
//         return typeof value === 'number'
//             && Number.isFinite(value)
//             && !(value % 1);
//     };

/**
 * @return {string}
 */
String.prototype.capitalize = function () {
    return this[0].toUpperCase() + this.substr(1).toLowerCase();
};





/**
 * @param {string} [key = 'id']
 * @return {Array}
 */
Array.prototype.extractKeyFromEachObject = function (key = 'id') {
    return this.filter(item => item.hasOwnProperty(key)).map(item => item[key]);
};

/**
 * @param {string} [key = 'id']
 * @return {Array}
 */
Array.prototype.convertEachValueToObject = function (key = 'id') {
    return this.map(value => ({[key]: value}));
};



/**
 * @param {string} searchString
 * @param {Number} [position]
 * @return {Number}
 */
String.prototype.caseInsensitiveIndexOf = function (searchString, position) {
    return this.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase(), position);
};

/**
 * @param {*} separator
 * @param {Number} [limit]
 * @return {Array}
 */
String.prototype.splitToInteger = function (separator, limit) {
    return this.split(separator, limit).filter(item => !parseInt(item).isNaN()).map(item => parseInt(item));
};

