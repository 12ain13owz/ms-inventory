"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io, socket) => {
    socket.on('status:create', (item) => {
        socket.broadcast.emit('status:create', item);
    });
    socket.on('status:update', (id, item) => {
        socket.broadcast.emit('status:update', id, item);
    });
    socket.on('status:delete', (id) => {
        socket.broadcast.emit('status:delete', id);
    });
};
