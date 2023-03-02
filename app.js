const amqp = require("amqplib");

require("dotenv").config();

// Function to consume messages
async function consumeMessages() {
  // Create connection to the rabbitMQ server
  const connection = await amqp.connect(process.env.RABBITMQ_URL);

  // Create a channel
  const channel = await connection.createChannel();

  // Create the exchange note the exchnage name should be the same
  // Pass in type of the exchange called direct
  await channel.assertExchange(process.env.EXCHANGE_NAME, "direct");

  // Create a queue
  const q = await channel.assertQueue(process.env.QUEUE_NAME);

  // Bind the queue
  // param 1 :  specify the queuename,
  // param 2 :  exchange name
  // param 3 : Routing key should match in order to consume the message.
  await channel.bindQueue(q.queue, process.env.EXCHANGE_NAME, "Info");

  channel.consume(q.queue, (msg) => {
    const data = JSON.parse(msg.content);
    console.log(data);
    channel.ack(msg);
  });
}
consumeMessages();
