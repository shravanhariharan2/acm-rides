const express = require('express');
const uuid = require('uuid');
const { getConsumer, getProducer } = require('./kafka');
const { getCostBetweenLocations } = require('./services/moneyService');
const Passenger = require('./models/passenger');
const Driver = require('./models/driver');
const Ride = require('./models/ride');

const router = express.Router();

router.post('/passenger', async (req, res, next) => {
  const { passenger } = req.body;

  passenger.id = uuid.v4();
  passenger.balance = 100;

  try {
    const createdPassenger = await Passenger.create(passenger);
    res.status(200).json({ passenger: createdPassenger });
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/passenger/ride', async (req, res, next) => {
  const { fromLocation, toLocation, passengerId } = req.body;
  const rideRequest = {
    id: uuid.v4(),
    fromLocation,
    toLocation,
    passenger: passengerId,
    driver: null,
    cost: getCostBetweenLocations(fromLocation, toLocation),
  }

  const producer = await getProducer();
  producer.send({
    topic: 'ride_requests',
    messages: [
      {
        value: JSON.stringify(rideRequest),
        timestamp: 200000,
      },
    ],
  });
  console.log('\n\nSend message to ride_requests message queue');

  res.status(201).json({ ride: rideRequest });
});

router.post('/driver', async (req, res, next) => {
  const { driver } = req.body;
  driver.id = uuid.v4();
  
  try {
    const createdDriver = await Driver.create(driver);
    res.status(200).json({ driver: createdDriver });
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

router.post('/driver/ride', async (req, res, next) => {
  const consumer = await getConsumer();
  const { driver } = req.body;

  await consumer.subscribe({ topic: 'ride_requests', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ message }) => {
      console.log("Received message from ride_requests message queue")
      const rideDetails = JSON.parse(message.value);
      
      rideDetails.driver = driver;

      try {
        await Ride.create(rideDetails);
        res.status(200).json({ ride: rideDetails });
        consumer.pause([{ topic: 'ride_requests' }]);
      } catch (e) {
        res.status(500).json({ error: e.message });
      }
    }
  });
});

module.exports = router;
