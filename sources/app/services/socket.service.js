/**
 * Created by niko on 03.10.16.
 */

angular.module('app').service('socketService', function (appConfig) {
    let socket = io(appConfig.backendUrl);
    let rooms = {};

    /**
     * @name socketService#subscribe
     * @param {string} roomName
     * @param {Function} [callback]
     */
    this.subscribe = (roomName, callback = () => {}) => {
        rooms[roomName] = [];

        socket.emit('subscribe', roomName);
        callback();
    };

    /**
     * @name socketService#unsubscribe
     * @param {string} roomName
     * @param {Function} [callback]
     */
    this.unsubscribe = (roomName, callback = () => {}) => {
        rooms[roomName].forEach(eventName => socket.removeListener(eventName));
        delete rooms[roomName];

        socket.emit('unsubscribe', roomName);
        callback();
    };

    /**
     * @name socketService#emit
     * @param {string} roomName
     * @param {string} eventName
     * @param data
     * @param {Function} [callback]
     */
    this.emit = (roomName, eventName, data, callback = () => {}) => {
        if (rooms.hasOwnProperty(roomName)) {
            rooms[roomName].push(eventName);
        }

        socket.emit('update', {room: roomName, event: eventName, data: data});
        callback();
    };

    /**
     * @name socketService#on
     * @param {string} roomName
     * @param {string} eventName
     * @param {Function} [callback]
     */
    this.on = (roomName, eventName, callback = () => {}) => {
        if (rooms.hasOwnProperty(roomName)) {
            rooms[roomName].push(eventName);
        }

        socket.on(eventName, req => callback.call(this, req.room == roomName ? req.data : null));
    };
});

