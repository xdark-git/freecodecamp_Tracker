const mongoose = require('../dbconnect/conn.js').mongoose;

const { Schema } = mongoose;

const exerciceSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: String
})

let Exercise = mongoose.model('Exersice', exerciceSchema);
Exercise.createCollection();

exports.Exercise = Exercise;