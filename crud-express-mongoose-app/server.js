const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Fruit = require('./models/fruit.js');

//... and then farther down the file
mongoose.connect('mongodb://localhost:27017/crud-express-mongoose-app', { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log('connected to mongo');
});

app.use(express.urlencoded({ extended: true }));

// SEED ROUTE
app.get('/fruits/seed', (req, res) => {
  Fruit.create([
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
  ], (err, data) => {
    res.json(data);
  })
});

// INDEX
app.get('/fruits', (req, res) => {
  Fruit.find({}, (error, allFruits) => {
    res.json(allFruits);
  });
});

// SHOW
app.get('/fruits/:id', (req, res) => {
  Fruit.findById(req.params.id, (err, foundFruit) => {
    res.json(foundFruit);
  });
});

// CREATE
app.post('/fruits', (req, res) => {
  if (req.body.readyToEat === 'on') { //if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true;
  } else { //if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false;
  }
  Fruit.create(req.body, (error, createdFruit) => {
    res.json(createdFruit);
  });
});

// UPDATE
app.put('/fruits/:id', (req, res) => {
  if (req.body.readyToEat === 'on') {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  Fruit.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, updatedModel) => {
    res.send(updatedModel);
  });
});


// DELETE
app.delete('/fruits/:id', (req, res) => {
  Fruit.findByIdAndRemove(req.params.id, (err, data) => {
    res.json(data);
  });
});


app.listen(3000, () => {
  console.log('listening');
});