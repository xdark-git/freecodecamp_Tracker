require('dotenv').config();
const mongoose = require('mongoose');

try
{
  mongoose.connect(process.env.MONGO_URI,{ useNewUrlParser: true, useUnifiedTopology: true })
}
catch(e)
{
  console.log(e)
}

exports.mongoose = mongoose;