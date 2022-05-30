const mongoose = require('../dbconnect/conn.js').mongoose;

const { Schema } = mongoose;

const logSchema = new Schema({
  username:{
    type: String,
    require: true
  },
  count: Number,
  log:[{
    description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: String
  }]
})

let Log = mongoose.model('Log', logSchema);
Log.createCollection()

exports.Log = Log;