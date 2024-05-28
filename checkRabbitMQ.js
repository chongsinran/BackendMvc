const amqp = require('amqplib');

const checkRabbitMQ = async () => {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await connection.createChannel();
    console.log('RabbitMQ is running and channel is created');
    await channel.close();
    await connection.close();
    return true;
  } catch (error) {
    console.error('RabbitMQ is not running:', error.message);
    return false;
  }
};

module.exports = checkRabbitMQ;