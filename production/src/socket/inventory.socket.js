"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io, socket) => {
    socket.on('inventory:create', (item) => {
        socket.broadcast.emit('inventory:create', item);
    });
    socket.on('inventory:update', (id, item) => {
        socket.broadcast.emit('inventory:update', id, item);
    });
};
