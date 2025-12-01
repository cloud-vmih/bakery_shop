import { Server } from 'socket.io';
import http from 'http';
import app from '../server';

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    },
});

io.on('connection', async (socket) => {
    console.log('Socket connected: ', socket.id);

    socket.on('disconnect', () => {
        console.log('Socket disconnected: ', socket.id);
    });
});

export { io, server};