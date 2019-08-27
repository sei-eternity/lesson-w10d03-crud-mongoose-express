const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Fruit = require('./models/fruit');

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/basiccrud', { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log('connected to mongo');
});

// INDEX
app.get('/fruits', (req, res) => {
  Fruit.find({}, (err, allFruits) => {
    if (err) { console.log(err) }
    res.json(allFruits);
  });
});

// SHOW
app.get('/fruits/:id', (req, res) => {
  Fruit.findById(req.params.id, (err, foundFruit) => {
    if (err) { console.log(err) }
    res.json(foundFruit);
  });
});


app.post('/fruits', (req, res) => {
  res.send('received');
});

// CREATE
// app.post('/fruits', (req, res) => {
//   console.log(req.body)
//   if (req.body.readyToEat === 'on') { //if checked, req.body.readyToEat is set to 'on'
//     req.body.readyToEat = true;
//   } else { //if not checked, req.body.readyToEat is undefined
//     req.body.readyToEat = false;
//   }
//   Fruit.create(req.body, (error, createdFruit) => {
//     res.json(createdFruit);
//   });
// });

// DELETE
app.delete('/fruits/:id', (req, res) => {
  Fruit.findByIdAndRemove(req.params.id, (err, data) => {
    if (err) { console.log(err) }
    res.json(data);
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
    res.json(updatedModel);
  });
});

// FRUITS SEED ROUTE
app.get('/fruits/seed', (req, res) => {
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


app.listen(3000, () => {
  console.log('listening');
});