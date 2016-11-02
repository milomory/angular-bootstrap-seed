/**
 * Created by niko on 04.10.16.
 *
 * @return {Array}
 */
Array.prototype.unique = function () {
    return this.filter((item, i, arr) => arr.indexOf(item) == i);
};

/**
 * Created by niko on 04.10.16.
 *
 * @return {string}
 */
String.prototype.capitalize = function () {
    return this[0].toUpperCase() + this.substr(1).toLowerCase();
};

/* jQuery */
$.fn.extend({
    animateCss: function (animationName, callback = () => {}) {
        let animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, callback.bind(this));
    }
});