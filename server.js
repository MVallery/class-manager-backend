const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const usersRoutes = require('./users-routes');
const HttpError = require('./http-error');


const app = express();


app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next();
});

app.use('/api/users/', usersRoutes);

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  } 
  res.status(error.code || 500);
  res.json({message: error.message || 'An unknown error occurred'});
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://clovy:clovypwd@cluster0.cbxzf.mongodb.net/classmanager?retryWrites=true&w=majority')
.then(()=>{
  app.listen(process.env.PORT || 5000);

})
.catch(err => {
  console.log(err);
})