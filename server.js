const express = require('express');

const app = express(); // create the express application
const port = process.env.PORT || 3000; // use environment defined port or 3000
const router = express.Router(); // create express Router

const log = require('./lib/logger');

// send the default route to /api
app.get('/', (req, res) => {
  res.redirect(301, '/api');
});

// Register all the routes to /api
app.use('/api', router);

/**
 * Dummy default route for testing
 */
// http://localhost:3000/api
router.get('/', (req, res) => {
  res.json({ message: 'You have reached beerlocker' });
});

// start the server
app.listen(port);
log.info('App initialized on port ', port);
