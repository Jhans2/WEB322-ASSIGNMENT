const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  topping: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  servings: {
    type: Number,
    required: true,
  },
  per_serving: {
    type: Number,
    required: true,
  },
  top_meal: {
    type: Boolean,
    required: true,
  },
  img: {
    type: String,
  },
});

const foodModel = mongoose.model("food", foodSchema);

module.exports = foodModel;