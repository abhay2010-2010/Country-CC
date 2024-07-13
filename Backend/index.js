require('dotenv').config()
const express = require('express');
const cors =require('cors');
const { dbToConnection } = require('./config/dbConnection');
const { userRouter } = require('./routes/userRoutes');
const { countryRouter } = require('./routes/countryRoutes');
const connectToDB = require('./config/dbConnection');

const app = express();

app.use(cors())
app.use(express.json());


app.use('/api/users', userRouter);
app.use('/api/countries', countryRouter);
// app.use('/api/flags', flagRouter); 

app.listen(5050,async()=>{
  try {
    await connectToDB;
    console.log("server connected succesfully")
  } catch (error) {
    console.log("server error: " + error)
  }

})