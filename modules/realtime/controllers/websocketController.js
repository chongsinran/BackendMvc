// realtime/controllers/websocketController.js

const subscriptions = {}; // Store subscriptions in memory (for simplicity)

exports.subscribe = (req, res) => {
  console.log('Request body:', req.body);
  const { clientId, topic } = req.body;

  if (!clientId || !topic) {
    return res.status(400).json({ error: 'clientId and topic are required' });
  }

  if (!subscriptions[clientId]) {
    subscriptions[clientId] = [];
  }

  subscriptions[clientId].push(topic);
  return res.status(200).json({ message: `Subscribed to topic: ${topic}` });
};

exports.getSubscriptions = () => subscriptions;
