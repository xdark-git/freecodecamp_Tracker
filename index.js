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


/*
* Create new user and return username and id
*/
app.post('/api/users', (req, res)=>{
  User.create({username: req.body.username},(error, data)=>{
    
    if(error) console.log(error)
    
    return res.json({
      username: data.username,
      _id: data._id
    })
    
  })
})

/*
* fetch data from user collection and return all username
* and id
*/
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
})
/*
POST to /api/users/:_id/exercises with form data description, duration, and optionally date. If no date is supplied, the current date will be used.
*/
app.post('/api/users/:_id/exercises', (req, res, next)=>{
  
  User.findById({_id: req.params._id})
      .select('_id')
      .exec((error, data)=>{
        
        if(error) {
          return res.json({
            error: "invalid id"
          })
        }
        if(data.length === 0){
          return res.json({
            error: "the id provided doesn't existe"
          })
        }
        if(data){
          next()
        } 
      })
}, (req, res)=>{
  
  let date;
  let username;
  let description = req.body.description;
  let duration = req.body.duration;
  
  if(req.body.date === '')
  {
    date = new Date().toDateString()
  }else{
    date = new Date(req.body.date).toDateString()
  }
/*
The response returned from POST /api/users/:_id/exercises will be the user object with the exercise fields added
*/
User.findById(req.params._id,'username')
      .exec((error, user)=>{
        username = user.username

        Exercise.create({
          username: username,
          description: description,
          duration: duration,
          date: date
        }, (error, exoAdded)=>{
          if(error) console.error(error)
          // Updating / creating new log if doesn't exist
          Log.findById(user._id, (error, userLog)=>{
            // console.log("in Log.findById")
            // console.log( error )
            // console.log(userLog)
            if(!userLog) {
              
              createLog(user.username, user._id, exoAdded.description, exoAdded.duration, exoAdded.date)
      
            }
            //updating it
            if(userLog){
              
              updateLog(user._id,userLog.count, exoAdded.description, exoAdded.duration, exoAdded.date)
              
            }
          })

          
          return res.json({
            _id: user._id,
            username: user.username,
            date: exoAdded.date,
            duration: exoAdded.duration,
            description: exoAdded.description
          })
        })
       
      })
})
// creating a function that create a newLog
function createLog(username, id, description, duration, date){
  Log.create({
      username: username,
      count: 1,
      _id: id,
      log:[{
        description: description,
        duration: duration,
        date: date,
      }]
    })
}
// updating Log
function updateLog(id, count , description, duration, date){
  count++

  Log.findById(id, (err, data)=>{
    data.count = count
    data.log.push({
      description: description,
      duration: duration,
      date: date
    })
    data.save((error, done)=>{
      if(error) console.error(error)
    })
  })
}
/*
GET request to /api/users/:_id/logs to retrieve a full exercise log of any user
*/
app.get('/api/users/:_id/logs', (req, res)=>{
 
  let limit = 0
  if(req.query.limit) 
    limit = req.query.limit
  console.log(req.query)
  
  Log.findById(req.params._id)
    .select('-_id -__v')
    .limit(limit)
    .exec((error, logData ) =>{
    // console.log(logData)
    if(error){
      return res.json({
        status: "the id provided doesn't existe"
      })  
    }
    if(!logData){
      return res.json({
        status: "no logs for this user"
      })  
    }
      // console.log(logData)
    if(logData){
      let arrDateConverted = []

      if(!req.query.from && !req.query.to)
      {
        for(let i in logData.log){
        
          let date = logData.log[i].date
          date = new Date().toDateString();
          
          arrDateConverted.push({
            description: logData.log[i].description,
            duration: logData.log[i].duration,
            date: date
          })
            
        }
      }
      if(req.query.from && req.query.to)
      {
        
        
        for(let i in logData.log){
          
          let date = logData.log[i].date
          console.log(`date : ${date}`)
          date = new Date().toDateString();
          req.query.from = new Date().toDateString();
          req.query.to  = new Date().toDateString();
          
          if(date >= req.query.from && date <= req.query.to)
          {
            // console.log("date >= from and date <= to ")
            arrDateConverted.push({
              description: logData.log[i].description,
              duration: logData.log[i].duration,
              date: date
            })
          }
      }
        // console.log(arrDateConverted)
         
        
      }
      let objReturned = {
          username: logData.username,
          count: logData.count,
          log: [...arrDateConverted]
        }
      return res.json(
          objReturned
        )
    } 
  })
  
})




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
