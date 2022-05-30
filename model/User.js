const mongoose = require('../dbconnect/conn.js').mongoose;

const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  }
})

let User = mongoose.model('User', userSchema);

User.createCollection();

exports.User = User;