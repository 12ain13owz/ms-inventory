"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io, socket) => {
    socket.on('log:create', (item) => {
        socket.broadcast.emit('log:create', item);
    });
};
