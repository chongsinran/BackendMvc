// senderClient.js
const axios = require('axios');
const WebSocket = require('ws');

const clientId = 'senderClient';
const topic = 'testTopic';

// Subscribe to a topic using the API
axios.post('http://localhost:3000/api/v1/subscribe', {
  clientId:clientId,
  topic:topic,
})
.then(response => {
  console.log(response.data.message);

  // Connect to the WebSocket server
  const ws = new WebSocket('ws://localhost:3000/ws');

  ws.on('open', function open() {
    console.log('WebSocket connected');
    // Send a message to the WebSocket server
    ws.send(JSON.stringify({ clientId, content: 'Hello from senderClient!' }));
  });

  ws.on('message', function incoming(data) {
    console.log('Received:', data);
  });

  ws.on('close', function close() {
    console.log('WebSocket disconnected');
  });
})
.catch(error => {
  console.error('Error subscribing to topic:', error);
});
