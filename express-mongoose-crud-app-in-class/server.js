const express = require('express');
const app = express();
const fruitsController = require('./controllers/fruitsController');

// BODY PARSER MIDDLEWARE
app.use(express.json());
app.use('/api/fruits', fruitsController);

app.listen(3000, () => {
  console.log("App is listening");
})