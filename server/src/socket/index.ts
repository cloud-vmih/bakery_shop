import { Server } from 'socket.io';
import http from 'http';
import app from '../server';
import { chatSocket } from './chat.socket';
import { socketAuth } from './auth.socket';
import { notificationSocket } from './notification.socket';

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true
    },
});

io.use(socketAuth);

io.on('connection', async (socket) => {
    console.log('Socket connected: ', socket.id);
    chatSocket(io, socket);
    notificationSocket(socket);

    socket.on('disconnect', () => {
        console.log('Socket disconnected: ', socket.id);
    });
});


export { io, server};