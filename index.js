const express = require('express')
const router = require('./api');

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use('/', router);

server.listen(3000, () => {
  console.log('Server started on port 3000');
});
