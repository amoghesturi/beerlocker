const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Beer = require('./models/beer');
const log = require('./lib/logger');

// Connect to app's mongoDB
mongoose.connect('mongodb://localhost:27017/beerlocker');

const app = express(); // create the express application
const port = process.env.PORT || 3000; // use environment defined port or 3000
const router = express.Router(); // create express Router

// Use body-parser in the application
app.use(bodyParser.urlencoded({
  extended: true,
}));

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

// All routes related to /api/beer
let beerRoute = router.route('/beers');

// POST /api/beers
beerRoute.post((req, res) => {
  const beer = new Beer();

  // read the beer details from POST data
  beer.name = req.body.name;
  beer.type = req.body.type;
  beer.quantity = req.body.quantity;

  // Save in the db
  beer.save((err) => {
    if (err) {
      log.error('Error adding beer to the db ', err);
      res.status(500).send(err);
    }
    res.json({ message: 'Beer added to the locker', data: beer });
  });
});

// GET /api/beers
beerRoute.get((req, res) => {
  Beer.find((err, beers) => { // eslint-disable-line
    if (err) {
      log.error('Error getting the list of beer ', err);
      res.status(500).send(err);
    }
    res.json(beers);
  });
});

// All routes related to /api/beer/beer_id
beerRoute = router.route('/beers/:beer_id');

// GET /api/beers/beer_id
beerRoute.get((req, res) => {
  const id = req.params.beer_id;
  Beer.findById(id, (err, beer) => {
    if (err) {
      log.error('Error getting details of the beer ', id, ' ', err);
      res.status(500).send(err);
    }
    res.json(beer);
  });
});

// PUT /api/beers/beer_id
beerRoute.put((req, res) => {
  const id = req.params.beer_id;
  const quantity = req.body.quantity;

  Beer.findById(id, (err, beer) => {
    if (err) {
      log.error('PUT /api/beers/beer_id Error getting details of the beer ', id, ' ', err);
      res.status(500).send(err);
    }

    beer.quantity = quantity; // eslint-disable-line
    beer.save((error) => {
      if (error) {
        log.error('PUT api/beers/beer_id Error updating ', error);
        res.status(500).send(error);
      }
      res.json(beer);
    });
  });
});

// DELETE /api/beers/beer_id
beerRoute.delete((req, res) => {
  const id = req.params.beer_id;

  Beer.findByIdAndRemove(id, (err) => {
    if (err) {
      log.error('Error deleting beer with id ', id, ' ', err);
      res.status(500).send(err);
    }

    res.json({ message: 'Beer remved from the locker' });
  });
});

// start the server
app.listen(port);
log.info('App initialized on port ', port);
