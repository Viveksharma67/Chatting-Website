const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// Initialize server
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

const users = {};
// Handle new client connections
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('new-user-joined', name =>{
        console.log("new user",name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined',name);
    });

    // Listen for chat messages
    socket.on('send-message', msg => {
        // Broadcast the message to other users
        socket.broadcast.emit('chat-message', { message: msg , name:users[socket.id]});
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const name = users[socket.id];
        if (name) {
            socket.broadcast.emit('user-left', `${name} has left the chat.`);
            console.log(`${name} disconnected.`);
            delete users[socket.id];
        }
    });
});

// Start the server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
