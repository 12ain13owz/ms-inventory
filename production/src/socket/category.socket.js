"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io, socket) => {
    socket.on('category:create', (item) => {
        socket.broadcast.emit('category:create', item);
    });
    socket.on('category:update', (id, item) => {
        socket.broadcast.emit('category:update', id, item);
    });
    socket.on('category:delete', (id) => {
        socket.broadcast.emit('category:delete', id);
    });
};
