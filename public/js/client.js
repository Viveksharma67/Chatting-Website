// Establish a connection to the server
const socket = io();

// DOM Elements
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');

// Prompt the user for their name and notify the server
const username = prompt('Enter your name:');
socket.emit('new-user-joined', username);

// Notify all users when a new user joins
socket.on('user-joined', (name) => {
    appendMessage(`${name} has joined the chat`, 'System');
});

// Listen for messages from the server
socket.on('chat-message', (data) => {
    appendMessage(data.message, data.name);
});
socket.on('user-left', (message) => {
    appendMessage(message, 'System');
});

// Form submission to send messages
messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    appendMessage(message, 'You');
    socket.emit('send-message', message); // Send message to the server
    messageInput.value = ''; // Clear input field
});

// Append a message to the chat container
function appendMessage(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('msg-item');
    messageElement.classList.add(sender === 'You' ? 'right' : 'left');
    messageElement.innerText = `${sender}: ${message}`;
    messageContainer.append(messageElement);
    messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll
}
