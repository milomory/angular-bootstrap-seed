/**
 * Created by niko on 21.09.16.
 */

require('jquery');
require('bootstrap');
require('bootstrap/dist/css/bootstrap.css');
require('bootswatch/united/bootstrap.css');
require('font-awesome/css/font-awesome.css');
require('awesome-bootstrap-checkbox/awesome-bootstrap-checkbox.css');

require('angular');
require('angular-animate');
require('angular-cookies');
require('angular-messages');
require('angular-resource');
require('angular-sanitize');

require('angular-bootstrap');
require('angular-translate');
require('angular-ui-router');
require('angular-ui-select');

window.requireAll = requireContext => requireContext.keys().map(requireContext);
window.io = require('socket.io-client/socket.io');

Array.prototype.unique = function () {
    return this.filter((item, i, arr) => arr.indexOf(item) == i);
};