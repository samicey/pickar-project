"use strict";
const path = require("path");
const bodyParser = require("body-parser");
const { App } = require("./config");
const { currency } = require("./models/task");

const cors = require("cors");
const express = require("express");

const app = express();

app.use(express.static(path.join(__dirname, 'currency-converter', 'dist')));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// add history
app.post("/data", (req, res) =>{
  const newCurrency = new currency(req.body);
  newCurrency.save().then((doc) => {
    return res.send(doc);
  }).catch((err)=>{
    return res.status(503).send({message:"Service unavailable. Try Later", err})
  });
});

// get all history
app.get("/all",(req, res)=>{
  currency.find().then((doc)=>{
    return res.status(200).send(doc)
  }).catch((err)=>{
      return res.status(503).send({message:"Service unavailable. Try Later", err})
  })
})

// clear history
app.delete("/delete", (req, res)=>{
  currency.deleteMany({}).then((doc)=>{
    if(!doc){
      return res.status(400).send({message:"Todo  not found"})
    }
    return res.status(200).send(doc)
  }).catch((err)=>{
    return res.status(503).send({message:"Service unavailable. Try Later", err})
  })
})

app.listen(App.PORT, () => {
  console.log("Started server at port " + App.PORT);
});

