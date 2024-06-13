// realtime/config/websocketConfig.js

const WebSocket = require('ws');

const clients = new Map();// Mapping of clientId to WebSocket clients
const auth = require('../../../../middlewares/ws_auth');
const initializeWebSocketServer = (server) => {
  const wss = new WebSocket.Server({ server, path: '/realtime/ws' });
  wss.on('connection', (ws, req) => {
    auth({ req }, (err, success) => {
      if (err || !success) {
        ws.close(4001, err.message);
        return;
      }

      console.log('Client connected, awaiting clientId...');

      // Set initial client properties
      ws.isAlive = true;

      // Handle incoming messages
      ws.on('message', (message) => {
        if (!isValidJSON(message)) {
          console.error(`Received invalid JSON: ${message}`);
          ws.send(JSON.stringify({ error: 'Invalid JSON format' }));
          return;
        }

        const parsedMessage = JSON.parse(message);

        if (!ws.clientId) {
          // First message should contain the clientId
          if (parsedMessage.type === 'register' && parsedMessage.clientId) {
            ws.clientId = parsedMessage.clientId;
            clients.set(ws, { id: ws.clientId, topics: [], isAlive: true });
            console.log(`Client registered with clientId: ${ws.clientId}`);
            ws.send(JSON.stringify({ type: 'registered', clientId: ws.clientId }));
          } else {
            ws.send(JSON.stringify({ error: 'First message must be registration with clientId' }));
          }
          return;
        }

        const clientId = ws.clientId;

        if (parsedMessage.type === 'subscribe') {
          // Subscribe to a topic
          clients.get(ws).topics.push(parsedMessage.topic);
          console.log(`Client ${clientId} subscribed to topic ${parsedMessage.topic}`);
        }

        if (parsedMessage.type === 'publish') {
          // Broadcast message to all clients subscribed to the topic
          const topic = parsedMessage.topic;
          const content = parsedMessage.content;
          console.log(`Publishing message to topic ${topic}: ${content}`);
          clients.forEach((client, clientWs) => {
            if (client.topics.includes(topic)) {
              clientWs.send(JSON.stringify({ topic, content }));
            }
          });
        }


        if (parsedMessage.type === 'unsubscribe') {
          const client = clients.get(ws);
          client.topics = client.topics.filter(topic => topic !== parsedMessage.topic);
          console.log(`Client ${clientId} unsubscribed from topic ${parsedMessage.topic}`);
        }

        if (parsedMessage.type === 'list_subscriptions') {
          // List topics the client is subscribed to
          const subscribedTopics = clients.get(ws).topics;
          ws.send(JSON.stringify({ type: 'subscribed_topics', topics: subscribedTopics }));
          console.log(JSON.stringify({ type: 'subscribed_topics', topics: subscribedTopics }))
        }










      });

      // Handle pings/pongs to keep connection alive
      ws.on('pong', () => {
        if (clients.has(ws)) {
          clients.get(ws).isAlive = true;
          // console.log("Pong")
        }
      });

      ws.on('close', () => {
        clients.delete(ws);
        console.log(`Client disconnected: ${ws.clientId}`);
      });

      ws.on('error', (error) => {
        console.error(`WebSocket error: ${error}`);
      });





    })


  });

  // Validate JSON
  function isValidJSON(message) {
    try {
      JSON.parse(message);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Ping clients every 30 seconds to keep connections alive
  const interval = setInterval(() => {

    wss.clients.forEach((ws) => {
      if (!clients.has(ws)) {
        // console.log('Skipping unregistered client.');
        return;
      }

      if (!clients.get(ws).isAlive) {
        console.log(`Terminating inactive client: ${ws.clientId}`);
        return ws.terminate();
      }

      clients.get(ws).isAlive = false;
      ws.ping(() => {
        // console.log("Ping")
      });
    });
  }, 30000);

  wss.on('close', () => {
    clearInterval(interval);
  });
  return wss;
};

module.exports = initializeWebSocketServer;
