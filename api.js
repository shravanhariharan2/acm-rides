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
  // TODO (1): send a message to the 'ride_requests' topic with the ride request data

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
  const { driver } = req.body;

  const consumer = await getConsumer();
  // TODO (2): subscribe to the 'ride_requests' topic and
  // define logic for what happens when a message is consumed
});

module.exports = router;
