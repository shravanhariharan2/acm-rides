const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'acm_rides',
  brokers: ['localhost:9092'],
});
const producer = kafka.producer();

const getProducer = async () => {
  await producer.connect();
  return producer;
}

const getConsumer = async () => {
  const consumer = kafka.consumer({ groupId: 'acm_rides' });
  await consumer.connect();
  return consumer;
}

module.exports = {
  getProducer,
  getConsumer,
}
