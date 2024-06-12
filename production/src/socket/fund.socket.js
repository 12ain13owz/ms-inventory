"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io, socket) => {
    socket.on('fund:create', (item) => {
        socket.broadcast.emit('fund:create', item);
    });
    socket.on('fund:update', (id, item) => {
        socket.broadcast.emit('fund:update', id, item);
    });
    socket.on('fund:delete', (id) => {
        socket.broadcast.emit('fund:delete', id);
    });
};
