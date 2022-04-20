const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();

var corsOptions = {
  origin: "*",
};
//Middlware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PORT
const port = 8000;

// databse connection
mongoose
  .connect(
    // "mongodb+srv://ritikramlogics:Ramlogics123@ramlogicsmail.cuop7.mongodb.net/Polycruz",
    "mongodb+srv://ramlogicsmanish:Ramlogics123@cluster0.mmwjs.mongodb.net/myFirstDatabase",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

//Routes
// initialize routes
app.use("/api", require("./Api/api"));

// Listening PORT
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
