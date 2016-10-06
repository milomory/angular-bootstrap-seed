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
 * @return {string}
 */
String.prototype.capitalize = function () {
    return this[0].toUpperCase() + this.substr(1).toLowerCase();
};