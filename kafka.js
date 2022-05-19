const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'acm_rides',
  brokers: ['localhost:9092'],
});
const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'acm_rides' });

const getProducer = async () => {
  await producer.connect();
  return producer;
}

const createConsumer = async () => {
  await consumer.connect();
  
  await consumer.subscribe({ topic: 'ride_requests', fromBeginning: true })

  await consumer.run({
    eachMessage: async ({ message }) => {
      const rideRequestMessage = message.value.toString();
    }
  })
}

// createConsumer();

module.exports = {
  getProducer,
}
