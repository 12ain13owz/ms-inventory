"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io, socket) => {
    socket.on('location:create', (item) => {
        socket.broadcast.emit('location:create', item);
    });
    socket.on('location:update', (id, item) => {
        socket.broadcast.emit('location:update', id, item);
    });
    socket.on('location:delete', (id) => {
        socket.broadcast.emit('location:delete', id);
    });
};
