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

## Initialize a directory

1. `mkdir express-mongoose-crud-app`
1. `npm init`
1. `npm install express`
1. `touch server.js`
1. Edit package.json to have `"main": "server.js",`

## Build express app

In `server.js`

```javascript
const express = require('express');
const app = express();

app.listen(3000, () => {
    console.log('listening');
});
```

<details>
<summary>New Fruit Form</summary>

```javascript
app.get('/fruits/new', (req, res)=>{
    res.send('new');
});
```

1. `mkdir views`
1. `npm install ejs`
1. `touch views/new.ejs`
1. Create the view

```html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <h1>New Fruit page</h1>
        <form action="/fruits" method="POST">
            Name: <input type="text" name="name" /><br/>
            Color: <input type="text" name="color" /><br/>
            Is Ready To Eat: <input type="checkbox" name="readyToEat" /><br/>
            <input type="submit" name="" value="Create Fruit"/>
        </form>
    </body>
</html>
```

Render the view

```javascript
app.get('/fruits/new', (req, res)=>{
    res.render('new.ejs');
});
```

</details>

## Test Fruit Route and `req.body`

Let's build a POST route first. In `server.js` add this:

```javascript
app.post('/fruits', (req, res)=>{
    res.send('received');
});
```

Test the route in Postman. Note - you do not have to enter any for data for this test.

![](https://i.imgur.com/31PbefZ.png)

#### Test form data with Postman

Next, we'll need to add some Express middleware to properly translate form data. Middleware is any code that we want to run between receiving the request and passing it along to the route. Typically, middleware is a `.use` method.

```javascript
app.use(express.urlencoded({extended:true}));
```

Check to see if `req.body` works, update the route to respond with the body of the form.

```javascript
app.post('/fruits', (req, res)=>{
    res.json(req.body);
});
```

In Postman, make sure that the Body is `x-www-form-urlencoded`. 

![](https://i.imgur.com/J4w2jmc.png)


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

![](https://i.imgur.com/SsDWb2T.png)

## Connect Express to Mongo

1. `npm install mongoose`
1. Inside server.js:

```javascript
const mongoose = require('mongoose');

//... and then farther down the file
mongoose.connect('mongodb://localhost:27017/basiccrud', { useNewUrlParser: true});
mongoose.connection.once('open', ()=> {
    console.log('connected to mongo');
});
```

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

## Create a Seed Route

Sometimes you might need to add data to your database for testing purposes.  You can do so like this:

```javascript
app.get('/fruits/seed', (req, res)=>{
    Fruit.create([
        {
            name:'grapefruit',
            color:'pink',
            readyToEat:true
        },
        {
            name:'grape',
            color:'purple',
            readyToEat:false
        },
        {
            name:'avocado',
            color:'green',
            readyToEat:true
        }
    ], (err, data)=>{
        res.redirect('/fruits');
    })
});
```

## Use Mongoose to persist Data in MongoDB

Inside `server.js`:

```javascript
const Fruit = require('./models/fruit.js');
//... and then farther down the file
app.post('/fruits/', (req, res)=>{
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

## INDEX Route

```javascript
app.get('/fruits', (req, res) => {
  Fruit.find({}, (error, allFruits) => {
    res.json(allFruits);
  });
});
```


## SHOW Route

```javascript
app.get('/fruits/:id', (req, res)=>{
    Fruit.findById(req.params.id, (err, foundFruit)=>{
        res.json(foundFruit);
    });
});
```

## DELETE Route

```javascript
app.delete('/fruits/:id', (req, res)=>{
    Fruit.findByIdAndRemove(req.params.id, (err, data)=>{
        res.json(data);
    });
});
```

## UPDATE Route

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