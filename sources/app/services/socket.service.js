/**
 * Created by niko on 03.10.16.
 */

angular.module('app').service('socketService', function (appConfig) {
    let socket = io(appConfig.backendUrl);
    let rooms = {};

    /**
     * @name socketService#subscribe
     * @param roomName
     * @param [callback]
     */
    this.subscribe = (roomName, callback = () => null) => {
        rooms[roomName] = [];

        socket.emit('subscribe', roomName);
        callback();
    };

    /**
     * @name socketService#unsubscribe
     * @param roomName
     * @param [callback]
     */
    this.unsubscribe = (roomName, callback = () => null) => {
        rooms[roomName].forEach(eventName => socket.removeListener(eventName));
        delete rooms[roomName];

        socket.emit('unsubscribe', roomName);
        callback();
    };

    /**
     * @name socketService#emit
     * @param roomName
     * @param eventName
     * @param data
     * @param [callback]
     */
    this.emit = (roomName, eventName, data, callback = () => null) => {
        if (rooms.hasOwnProperty(roomName)) {
            rooms[roomName].push(eventName);
        }

        socket.emit('update', {room: roomName, event: eventName, data: data});
        callback();
    };

    /**
     * @name socketService#on
     * @param roomName
     * @param eventName
     * @param [callback]
     */
    this.on = (roomName, eventName, callback = () => null) => {
        if (rooms.hasOwnProperty(roomName)) {
            rooms[roomName].push(eventName);
        }

        socket.on(eventName, req => callback.call(this, req.room == roomName ? req.data : null));
    };
});

