const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fruitSchema = new Schema({
  name: { type: String, required: true },
  color: { type: String, required: true },
  readyToEat: Boolean
}, { timestamps: true })

const Fruit = mongoose.model('Fruit', fruitSchema);

module.exports = Fruit;