const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Fruit = require('../models/fruit');

mongoose.connect('mongodb://localhost:27017/basiccrud', { useNewUrlParser: true })
mongoose.connection.once('open', () => {
  console.log('Connected to Mongo');
})
mongoose.set('useFindAndModify', false);

// FRUITS SEED ROUTE
router.get('/seed', (req, res) => {
  Fruit.insertMany([
    {
      name: 'grapefruit',
      color: 'pink',
      readyToEat: true
    },
    {
      name: 'grape',
      color: 'purple',
      readyToEat: false
    },
    {
      name: 'avocado',
      color: 'green',
      readyToEat: true
    }
  ], (err, fruits) => {
    res.json(fruits);
  })
});

// POST ROUTE
router.post('/', (req, res) => {
  if (req.body.readyToEat === 'on') {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  Fruit.create(req.body, (error, newFruit) => {
    res.json(newFruit)
  })
})

// INDEX ROUTE
router.get('/', (req, res) => {
  Fruit.find({}, (error, fruits) => {
    res.json({ fruits })
  })
})

// SHOW ROUTE
router.get('/:id', (req, res) => {
  Fruit.findById(req.params.id, (error, fruit) => {
    res.json(fruit);
  })
})

// DELETE
router.delete('/:id', (req, res) => {
  Fruit.findByIdAndDelete(req.params.id, (error, deletedFruit) => {
    if (error) { res.json(error) }
    res.json(deletedFruit)
  })
})

// PUT
router.put('/:id', (req, res) => {
  Fruit.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (error, updatedFruit) => {
      res.json(updatedFruit)
    })
})

module.exports = router;


