// websocketClient.js
const WebSocket = require('ws');

const clientId = Math.random().toString()

const dotenv = require('dotenv');
dotenv.config();
const ws = new WebSocket('ws://localhost:3000/realtime/ws',
  {
    headers: {
      Authorization: `Bearer ${process.env.ADMIN_TOKEN }`
    }
  });

ws.on('open', function open() {
  console.log('WebSocket connected');
  // Notify server of client ID
  // ws.send(JSON.stringify({ clientId }));

  // Send a message to the WebSocket server


  ws.send(JSON.stringify({ clientId, type: 'register' }));
  setTimeout(() => {
    ws.send(JSON.stringify({ clientId, type: 'subscribe', topic: "asdasd" }));
  }, 1000);

  setInterval(() => {
    ws.send(JSON.stringify({
      "type": "publish",
      "topic": "asdasd",
      "content": "Hello, this is a test message!"
    }))
  }, 5000);
  // ws.send(JSON.stringify({ clientId, content: 'Hello WebSocket!' }));
});

ws.on('message', function incoming(data) {
  console.log('Received:', data.toString());
});

ws.on('close', function close() {
  console.log('WebSocket disconnected');
});