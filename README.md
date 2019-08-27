# CRUD Express App with Mongoose

## Lesson Objectives

1. Initialize a directory
1. Start express
1. Connect Express to Mongo
1. SEED DB
1. Create INDEX
1. Create CREATE Route
1. Create Fruits Model
1. Have Create Route Create data in MongoDB
1. INDEX Route
1. SHOW Route
1. DELETE Route
1. UPDATE Route

<br>

## Initialize a directory

1. `mkdir express-mongoose-crud-app`
1. `npm init`
1. `npm install express`
1. `touch server.js`
1. Edit package.json to have `"main": "server.js",`

<br>

## Build express app

In `server.js`

```javascript
const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('listening');
});
```
<br>

## Test Fruit Route and `req.body`

Let's build a POST route first. In `server.js` add this:

```javascript
app.post('/fruits', (req, res)=>{
    res.send('received');
});
```

Test the route in Postman. Note - you do not have to enter any for data for this test.

![](https://i.imgur.com/HRE6LmE.png)

#### Test JSON request data with Postman

Next, we'll need to add some Express middleware to properly translate JSON data. Middleware is any code that we want to run between receiving the request and passing it along to the route. Typically, middleware is a `.use` method. 

[Body Parser](https://www.npmjs.com/package/body-parser) is an npm package that creates a `req.boody` object. It is now included in Express by default.

```javascript
app.use(express.json());
```

Check to see if `req.body` works, update the route to respond with the body of the form.

```javascript
app.post('/fruits', (req, res)=>{
    res.json(req.body);
});
```

In Postman, make sure that the Body is `raw` JSON. 

![](https://i.imgur.com/sGfsHhy.png)


Let's add some conditional logic based on whether a fruit is ripe and `readyToEat`. This will imitate a checkbox in a form:

```javascript
app.post('/fruits', (req, res)=>{
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
    res.json(req.body);
});
```

![](https://i.imgur.com/EH1EhnJ.png)

<br>

## Connect Express to Mongo

1. `npm install mongoose`
1. Inside `server.js`:

```javascript
const mongoose = require('mongoose');

//... and then farther down the file
mongoose.connect('mongodb://localhost:27017/basiccrud', { useNewUrlParser: true});
mongoose.connection.once('open', ()=> {
    console.log('connected to mongo');
});
```

<details>
<summary>Our server.js so far</summary>
	
	
```js
const express = require('express');
const app = express();
const mongoose = require('mongoose');
	
app.use(express.urlencoded({ extended: true }));
	
mongoose.connect('mongodb://localhost:27017/basiccrud', { useNewUrlParser: true });
mongoose.connection.once('open', () => {
  console.log('connected to mongo');
});
	
app.post('/fruits', (req, res) => {
  if (req.body.readyToEat === 'on') { //if checked, req.body.readyToEat is set to 'on'
    req.body.readyToEat = true;
  } else { //if not checked, req.body.readyToEat is undefined
    req.body.readyToEat = false;
  }
  res.json(req.body);
});
	
app.listen(3000, () => {
  console.log('listening');
});
```

</details>

<br>


## Create Fruits Model

1. `mkdir models`
1. `touch models/fruit.js`
1. Create the fruit schema

	```javascript
	const mongoose = require('mongoose');
	
	const fruitSchema = new mongoose.Schema({
	    name:  { type: String, required: true },
	    color:  { type: String, required: true },
	    readyToEat: Boolean
	});
	
	const Fruit = mongoose.model('Fruit', fruitSchema);
	
	module.exports = Fruit;
	```

1. Import `Fruit` into `server.js`

	```js
	const mongoose = require('mongoose');
	const Fruit = require('./models/fruit');
	
	```

<br>

## Create a Seed Route

Sometimes you might need to add data to your database for testing purposes.  You can do so like this via a route:

```javascript
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
```

![](https://i.imgur.com/K9oPPyI.png)

<br>

## Use Mongoose to persist Data in MongoDB

Inside `server.js`.

#### CREATE Route

```javascript
app.post('/fruits', (req, res)=>{
    if(req.body.readyToEat === 'on'){ //if checked, req.body.readyToEat is set to 'on'
        req.body.readyToEat = true;
    } else { //if not checked, req.body.readyToEat is undefined
        req.body.readyToEat = false;
    }
    Fruit.create(req.body, (error, createdFruit)=>{
        res.json(createdFruit);
    });
});
```

![](https://i.imgur.com/7lFtkTg.png)

#### INDEX Route

```javascript
app.get('/fruits', (req, res) => {
  Fruit.find({}, (err, allFruits) => {
    if (err) { console.log(err) }
    res.json(allFruits);
  });
});
```

#### SHOW Route

```javascript
app.get('/fruits/:id', (req, res)=>{
  Fruit.findById(req.params.id, (err, foundFruit)=>{
    if (err)  { res.send(err) }
    res.json(foundFruit);
  });
});
```

![](https://i.imgur.com/4wg18Ki.png)

#### DELETE Route

```javascript
app.delete('/fruits/:id', (req, res)=>{
  Fruit.findByIdAndRemove(req.params.id, (err, deletedFruit)=>{
	 if (err)  { console.log(err) }
    res.json(deletedFruit);
  });
});
```

#### UPDATE Route

```javascript
app.put('/fruits/:id', (req, res)=>{
    if(req.body.readyToEat === 'on'){
        req.body.readyToEat = true;
    } else {
        req.body.readyToEat = false;
    }
    Fruit.findByIdAndUpdate(req.params.id, req.body, {new:true}, (err, updatedModel)=>{
        res.send(updatedModel);
    });
});
```

![](https://i.imgur.com/TUKzsE5.png)

<br>

## Additional Resources

- [Mongoose Docs](https://mongoosejs.com/)