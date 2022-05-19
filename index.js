const express = require('express')
const router = require('./api');
const Driver = require('./models/driver');
const Passenger = require('./models/passenger');
const Ride = require('./models/ride');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/', router);


const createTables = async () => {
  await Driver.sync();
  await Passenger.sync();
  await Ride.sync();
  console.log('Synced database tables')
}

createTables();

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
