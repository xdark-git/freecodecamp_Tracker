const express = require('express')
const app = express()
const bodyParser = require("body-parser")
const cors = require('cors')
const User = require('./model/User').User
const Exercise = require('./model/Exercise').Exercise
const Log = require('./model/Log').Log

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Creating a new user

app.post('/api/users', (req, res)=>{
  User.create({username: req.body.username},(error, data)=>{
    
    if(error) console.log(error)
    
    return res.json({
      username: data.username,
      _id: data._id
    })
    
  })
})
app.get('/api/users', (req, res)=>{

  let usersData = [];
  User.find({})
    .select('username _id')
    .exec((error, data) =>{
    if(error) console.error(error)
    for(let i in data){
      let obj = {
        username: data[i].username,
        _id: data[i]._id
      }
      usersData.push(obj)
    }
   return res.json(
        usersData
    )
  })
  // usersData.push({"a":1})
  // console.log(usersData)
  
  
})





const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
